"use client"

import { useCallback, useEffect, useState } from "react"
import { apiRequest, ClientApiError } from "@/lib/api/client"
import { asArray } from "@/lib/api/normalize"
import {
    mapBackendCustomerToUI,
    mapBackendTransactionToDetail,
    mapBackendTransactionToRow,
} from "@/lib/types/mappers"
import type { Customer, TransactionData } from "@/lib/mockData"
import type {
    BackendCustomer,
    BackendTransaction,
    DashboardSummary,
    TransactionsSummary,
} from "@/lib/types/api"

interface AsyncState<T> {
    data: T
    isLoading: boolean
    error: string | null
}

function useAsync<T>(
    fetcher: () => Promise<T>,
    initial: T,
    deps: unknown[] = []
): AsyncState<T> & { refetch: () => void } {
    const [state, setState] = useState<AsyncState<T>>({
        data: initial,
        isLoading: true,
        error: null,
    })
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let cancelled = false
        setState((s) => ({ ...s, isLoading: true, error: null }))
        fetcher()
            .then((data) => {
                if (!cancelled)
                    setState({ data, isLoading: false, error: null })
            })
            .catch((err) => {
                if (cancelled) return
                const message =
                    err instanceof ClientApiError
                        ? err.message
                        : "Failed to load data"
                setState({ data: initial, isLoading: false, error: message })
            })
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey, ...deps])

    return { ...state, refetch: () => setReloadKey((k) => k + 1) }
}

/** Replaces `mockCustomers` from lib/mockData.ts with live /portal/customers data. */
export function useCustomers() {
    const fetcher = useCallback(async () => {
        const payload = await apiRequest<unknown>("/api/portal/customers")
        return asArray<BackendCustomer>(payload).map((c) =>
            mapBackendCustomerToUI(c)
        )
    }, [])
    return useAsync<Customer[]>(fetcher, [])
}

/** Replaces `getCustomerById` with a live lookup + statement fetch. */
export function useCustomer(customerId: string) {
    const fetcher = useCallback(async () => {
        const [customer, statement] = await Promise.all([
            apiRequest<BackendCustomer>(
                `/api/portal/customers/${encodeURIComponent(customerId)}`
            ),
            apiRequest<unknown>(
                `/api/portal/customers/${encodeURIComponent(customerId)}/statement`
            ).catch(() => []),
        ])
        const transactions = asArray<BackendTransaction>(statement)
        return mapBackendCustomerToUI(customer, transactions)
    }, [customerId])
    return useAsync<Customer | null>(fetcher, null, [customerId])
}

/** Replaces `mockTransactions` + the derived deposit total. There is no
 * real "withdrawal" concept on this backend (TransactionType is always
 * "inbound"), so totalWithdrawals/netPosition are not meaningful here. */
export function useTransactions() {
    const fetcher = useCallback(async () => {
        const payload = await apiRequest<unknown>("/api/portal/transactions")
        return asArray<BackendTransaction>(payload).map(
            mapBackendTransactionToRow
        )
    }, [])
    const state = useAsync<TransactionData[]>(fetcher, [])

    const summaryFetcher = useCallback(
        () =>
            apiRequest<TransactionsSummary>("/api/portal/transactions/summary"),
        []
    )
    const summary = useAsync<TransactionsSummary | null>(summaryFetcher, null)

    const clientDeposits = state.data.reduce((sum, t) => sum + t.amount, 0)

    const totalDeposits =
        summary.data?.total_deposits !== undefined
            ? Number(summary.data.total_deposits)
            : clientDeposits

    return {
        ...state,
        totalDeposits,
    }
}

/** GET /portal/transactions/recent - used for the dashboard's recent-activity list. */
export function useRecentTransactions() {
    const fetcher = useCallback(async () => {
        const payload = await apiRequest<unknown>(
            "/api/portal/transactions/recent"
        )
        return asArray<BackendTransaction>(payload).map(
            mapBackendTransactionToRow
        )
    }, [])
    return useAsync<TransactionData[]>(fetcher, [])
}

/** Replaces the hand-computed metrics in DashboardOverview with /portal/dashboard/summary. */
export function useDashboardSummary() {
    const fetcher = useCallback(
        () => apiRequest<DashboardSummary>("/api/portal/dashboard/summary"),
        []
    )
    return useAsync<DashboardSummary | null>(fetcher, null)
}

export { mapBackendTransactionToDetail }
