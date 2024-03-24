'use client'

import { NextUIProvider } from '@nextui-org/react'
import React, { ReactNode } from 'react'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({children}: {children: ReactNode}) {
  return (
    <NextUIProvider>
      <ToastContainer position='bottom-right' hideProgressBar className='z-50' />
        {children}
    </NextUIProvider>
  )
}