"use client"

import React from "react"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Zap } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SimulateTransfer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="bg-teal-400 hover:bg-teal-400 hover:text-slate-950 text-slate-950">
          <Zap className="mr-2 h-4 w-4" /> Simulate transfer
        </Button>
      </SheetTrigger>

      <SheetContent side="center" className="max-w-2xl mx-auto rounded-xl overflow-hidden bg-white">
        <SheetHeader className="bg-[#07182a] px-6 py-4 text-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold text-slate-50">Simulate incoming transfer</SheetTitle>
              <SheetDescription className="text-sm text-slate-200">POST /webhooks/dva-funding</SheetDescription>
            </div>
            <div />
          </div>
        </SheetHeader>

        <div className="px-6 py-6">
          <div className="mb-4">
            <Label className="mb-2">Destination investor (NUBAN)</Label>
            <Input className="h-12 rounded-lg border border-slate-200" placeholder="Please input account number" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Amount (₦)</Label>
              <Input className="h-12 rounded-lg border border-slate-200" defaultValue="60000" />
            </div>
            <div>
              <Label className="mb-2">Sender bank</Label>
              <Select>
                <SelectTrigger className="h-12 rounded-lg border border-slate-200">
                    <SelectValue placeholder="Select Bank" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="access-bank">Access Bank</SelectItem>
                    <SelectItem value="gtbank">GTBank</SelectItem>
                    <SelectItem value="first-bank">First Bank</SelectItem>
                    <SelectItem value="uba">UBA</SelectItem>
                    <SelectItem value="zenith">Zenith Bank</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
            Simulate misdirected transfer (invalid NUBAN — funds quarantined)
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-md border border-slate-200 bg-white p-4">
            <div className="text-center">
              <div className="text-xs text-slate-500">BANK TRANSFER</div>
              <div className="mt-2 font-semibold text-slate-900">₦60,000</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500">WALLET CREDITED</div>
              <div className="mt-2 font-semibold text-teal-500">₦60,000</div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <div className="flex items-center justify-between">
            <Button variant="outline" className="rounded-lg hover:bg-white">Cancel</Button>
            <Button className="bg-[#06b6d4] hover:bg-[#05aabf] text-white rounded-lg"><Zap className="mr-2" /> Send transfer</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
