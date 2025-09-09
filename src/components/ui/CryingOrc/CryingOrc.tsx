import Image from 'next/image';

export default function CryingOrc() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Заголовок */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8">
          Воровать - плохо
        </h1>
        
        {/* Картинка */}
        <div className="relative w-full max-w-md mx-auto mb-8">
          <Image
            src="/assets/images/crying-orc.png" // Путь к вашей картинке в папке public/static/
            alt="Воровать - плохо"
            width={360}
            height={360}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
        
        {/* Дополнительный текст (опционально) */}
        <p className="text-lg text-gray-600 mb-8">
          Уважайте чужой труд и интеллектуальную собственность
        </p>
      </div>
    </div>
  );
}