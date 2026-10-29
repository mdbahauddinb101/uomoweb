import Image from "../common/Image"


const ShopBanner = () => {
  const categories = [
    "#STAYHOME",
    "NEW IN",
    "JACKETS",
    "HOODIES",
    "MEN",
    "WOMEN",
    "TROUSERS",
    "ACCESSORIES",
    "SHOES",
  ];
  const categoryClassName =
    "relative shrink-0 text-[10px] leading-4 font-medium text-primary after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-primary after:duration-500 after:content-[''] hover:after:w-full sm:text-xs sm:leading-6 lg:text-sm";

  return (
  <section className="container relative px-4 sm:px-6 lg:px-0">
    
        <Image className="block h-36 w-full object-cover object-center sm:h-56 lg:h-80" src="/src/assets/ShopImages/ShopBannerBg.png" alt="ShopBanner" />
        <div className="absolute inset-x-4 top-1/2 w-auto -translate-y-1/2 text-center sm:inset-x-6 lg:inset-x-0">
            <h2 className="text-primary text-xl font-bold sm:text-3xl lg:text-4xl">SHOES</h2>
            <ul className="mx-auto mt-3 flex max-w-full flex-wrap justify-center gap-x-3 gap-y-1 px-2 sm:mt-6.5 sm:gap-x-5 sm:gap-y-2 lg:gap-x-7.5">
              {categories.map((category) => (
                <li className={categoryClassName} key={category}>
                  {category}
                </li>
              ))}
            </ul>
        </div>
    
  </section>
  )
}

export default ShopBanner