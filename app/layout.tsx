import type { Metadata } from 'next';
import './globals.css';
import './video.css';
export const metadata:Metadata={title:'EBOOK AI STUDIO — O seu próximo capítulo',description:'Crie, organize e prepare os seus ebooks num único estúdio.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-PT"><body>{children}</body></html>}
