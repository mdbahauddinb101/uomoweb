import Image from "../common/Image";

const Logos = () => {
  return (
    <section className="mb-25.5">
      <div className="container">
        <h2 className="text-center font-jost text-[35px] leading-[100%] uppercase mt-20.75 mb-8.5">@UOMO</h2>
        <div className="flex flex-wrap justify-center items-center gap-1 mt-10">
          <Image src="/src/assets/IMG-1.png" className="w-29.5 lg:w-auto" />
          <Image src="/src/assets/IMG-2.png" className="w-29.5 lg:w-auto" />
          <Image src="/src/assets/IMG-3.png" className="w-29.5 lg:w-auto" />
          <Image src="/src/assets/IMG-4.png" className="w-29.5 lg:w-auto" />
          <Image src="/src/assets/IMG-5.png" className="w-29.5 lg:w-auto" />
          <Image src="/src/assets/IMG-6.png" className="w-29.5 lg:w-auto" />
          <Image src="/src/assets/IMG-7.png" className="w-29.5 lg:w-auto" />
          <Image src="/src/assets/IMG-8.png" className="w-29.5 lg:w-auto" />
          <Image src="/src/assets/IMG-9.png"  className="w-29.5 lg:w-auto"/>
          <Image src="/src/assets/IMG-10.png" className="w-29.5 lg:w-auto" />
          <Image src="/src/assets/IMG-11.png" className="w-29.5 lg:w-auto" />
          <Image src="/src/assets/IMG-12.png" className="w-29.5 lg:w-auto" />
        </div>
      </div>
    </section>
  );
};

export default Logos;
