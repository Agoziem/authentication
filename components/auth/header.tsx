import React from 'react'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'

const font = Poppins({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
})

interface HeaderProps {
    Label: string;
}
export const Header = ({
    Label,
}:HeaderProps) => {
  return (
    <div className='w-full flex flex-col gap-y-2 items-center'>
        <h1 className={cn(font.className, 'text-4xl font-semibold')}>Auth</h1>
        <p className='text-muted-foreground text-small'> 
            {Label}
        </p>
    </div>
  )
}
