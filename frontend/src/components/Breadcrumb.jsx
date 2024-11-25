import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export function Breadcrumbs() {
  const pathSegments = location.pathname.replace(/^\/+|\/+$/g, "").split("/");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={
              pathSegments.length == 1
                ? "/dashboard"
                : `/${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}`
            }
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.length > 3 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                {`${pathSegments[3][0].toUpperCase()}${pathSegments[3].slice(
                  1
                )}`}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
