'use client';

import React, { useState, useRef } from 'react';

import { generateIcons } from '@/utils/generate';


const App: React.FC = () => {
  const [normalImage, setNormalImage] = useState<HTMLImageElement | null>(null);
  const [smallImage, setSmallImage] = useState<HTMLImageElement | null>(null);
  const [androidIconName, setAndroidIconName] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Função para carregar a imagem normal
  const handleNormalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          setNormalImage(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para carregar a imagem small
  const handleSmallImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          setSmallImage(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateIcons = () => {
    generateIcons({
      normalImage,
      smallImage,
      androidIconName,
      canvasRef,
      })
  }


  return <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
  <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
  <div className="flex flex-col gap-3 pb-4 items-center">
       <h1 className="text-2xl font-bold text-[#4B5563] my-auto">Icon Notification Generator</h1>
       <div className="text-sm font-light text-[#6B7280] pb-8 ">Gerar icone para notificação do Android</div>
  </div>
  
  <form className="flex flex-col">
      <div className="pb-2">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#111827]">Carregar Imagem Normal</label>
          <div className="relative text-gray-400">
              <input className="mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" autoComplete="off" type="file" accept="image/*" onChange={handleNormalImageUpload} />
          </div>
      </div>
      <div className="pb-2">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#111827]">Carregar Imagem Small</label>
          <div className="relative text-gray-400">
              <input className="mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" autoComplete="off" type="file" accept="image/*" onChange={handleSmallImageUpload} />
          </div>
      </div>
      <div className="pb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#111827]">Nome do Ícone</label>
          <div className="relative text-gray-400">
              <input className=" mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" autoComplete="new-password" type="text" value={androidIconName} onChange={(e) => setAndroidIconName(e.target.value)} />
          </div>
      </div>
      <button type="submit" className="w-full text-[#FFFFFF] bg-[#4F46E5] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6" onClick={handleGenerateIcons}>Gerar Ícones</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
  </form>
</div>
</div>
}
  
export default App;