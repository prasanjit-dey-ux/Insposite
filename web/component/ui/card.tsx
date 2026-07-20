'use client'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { SiteItem } from '@/types/site'

export default function Card({image, title, className, tag, url, creator}: SiteItem) {
  
  let username = creator 
    ? creator.replace("https://", "")
    .replace("http://", "")
    .split("/")
    .filter(Boolean)
    .pop()
    : null; 

  if (username === "www.finniansturdy.com" || username === "finniansturdy.com") {
    username = "finniansturdy";
  } 
  
  const taggedUrl = (() => {
    try {
      const u = new URL(url);
      u.searchParams.set("ref", "insposite");
      return u.toString();
    } catch {
      return url; // fallback for invalid URLs
    }
  })();

  return (
    <div className={clsx('border border-slate-300 rounded-lg overflow-hidden group', className)}>
        
    <Link href={taggedUrl} target='_blank' rel='noopener noreferrer'>
      <div className=' relative aspect-4/2 overflow-hidden rounded-t-lg'>
          {image ? (
            <Image  
            src={image}
            alt={title}
            fill
            className='object-cover object-top transition-transform ease-in-out duration-300 group-hover:scale-[1.05]'
        />
          ): (
            <div className="flex items-center justify-center h-full bg-zinc-50 text-zinc-400">
              {title}
            </div>
          )}

        <div className=' absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center'>
          <span className='rounded-md px-2 py-1 text-sm font-medium flex justify-center items-center bg-neutral-50 text-neutral-950'>Visit →</span>
        </div>
      </div>
    </Link>

<div className="flex justify-between items-end px-4 py-3 bg-neutral-50">
    <div className='flex flex-col items-start justify-center gap-1'>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-zinc-500 text-sm font-medium">{tag}</p>
    </div>

    { creator && username  && (
      <Link 
      href={creator}
      target='_blank'
      className='text-zinc-500 text-sm font-medium hover:underline hover:text-blue-700'
      >
        {username}
      </Link>
    )}

  </div>

    </div>
  )
}


