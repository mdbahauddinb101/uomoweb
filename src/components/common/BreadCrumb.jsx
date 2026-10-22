import { useLocation, Link } from "react-router";

const BreadCrumb = () => {
  let { pathname } = useLocation();


  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <section className="w-full">
      <ul className="flex items-center font-medium text-sm text-primary leading-6 uppercase gap-3">
    
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>

    
        {pathSegments.map((segment, index) => {
          // Recreate the route up to this segment
          const routeTo = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          const formattedName = decodeURIComponent(segment).replace(/[-_]/g, " ");

          return (
            <li key={routeTo} className="flex items-center gap-3">

              <span className="text-primary/70">/</span>

              {isLast ? (
                <span className="text-primary font-semibold">{formattedName}</span>
              ) : (
                <Link to={routeTo} className="hover:underline">
                  {formattedName}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default BreadCrumb;