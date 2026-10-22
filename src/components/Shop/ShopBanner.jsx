import Image from "../common/Image"


const ShopBanner = () => {
  return (
  <section className="px-15 relative">
    
        <Image className=" w-full" src="/src/assets/ShopImages/ShopBannerBg.png" alt="ShopBanner" />
        <div className="absolute top-2/4 left-0 text-center w-full translate-y-[-50%]">
            <h2 className="text-primary font-bold text-[60px]">SHOES</h2>
            <ul className="flex justify-center gap-7.5 mt-6.5">
                <li className="font-medium text-base text-primary after:-translate-x-1/2 after:bg-primary relative  leading-6  after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full">#STAYHOME</li>
                <li className="font-medium text-base text-primary after:-translate-x-1/2 after:bg-primary relative  leading-6  after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full">NEW IN</li>
                <li className="font-medium text-base text-primary after:-translate-x-1/2 after:bg-primary relative  leading-6 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full">JACKETS</li>
                <li className="font-medium text-base text-primary after:-translate-x-1/2 after:bg-primary relative  leading-6  after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full"> HOODIES</li>
                <li className="font-medium text-base text-primary after:-translate-x-1/2 after:bg-primary relative leading-6  after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full">MEN</li>
                <li className="font-medium text-base text-primary after:-translate-x-1/2 after:bg-primary relative  leading-6 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full">WOMEN</li>
                <li className="font-medium text-base text-primary after:-translate-x-1/2 after:bg-primary relative  leading-6 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full">TROUSERS</li>
                <li className="font-medium text-base text-primary after:-translate-x-1/2 after:bg-primary relative  leading-6 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full"> ACCESSORIES</li>
                <li className="font-medium text-base text-primary after:-translate-x-1/2 after:bg-primary relative  leading-6 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full"> SHOES</li>
                
            </ul>
        </div>
    
  </section>
  )
}

export default ShopBanner