'use client'

import { NextUIProvider } from '@nextui-org/react'
import React, { ReactNode } from 'react'

export default function Providers({children}: {children: ReactNode}) {
  return (
    <NextUIProvider>
        {children}
    </NextUIProvider>
  )
}