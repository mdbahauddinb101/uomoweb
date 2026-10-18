import Image from "../common/Image";

const Logos = () => {
  return (
    <section className="mb-25.5">
      <div className="container">
        <h2 className="text-center font-jost text-[35px] leading-[100%] uppercase mt-20.75 mb-8.5">@UOMO</h2>
        <div className="flex flex-wrap justify-center items-center gap-1 mt-10">
          <Image src="/src/assets/IMG-1.png" />
          <Image src="/src/assets/IMG-2.png" />
          <Image src="/src/assets/IMG-3.png" />
          <Image src="/src/assets/IMG-4.png" />
          <Image src="/src/assets/IMG-5.png" />
          <Image src="/src/assets/IMG-6.png" />
          <Image src="/src/assets/IMG-7.png" />
          <Image src="/src/assets/IMG-8.png" />
          <Image src="/src/assets/IMG-9.png" />
          <Image src="/src/assets/IMG-10.png" />
          <Image src="/src/assets/IMG-11.png" />
          <Image src="/src/assets/IMG-12.png" />
        </div>
      </div>
    </section>
  );
};

export default Logos;
