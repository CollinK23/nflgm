export const handlePathChange = (value, location) => {
  let pathSegments = location.pathname.replace(/^\/+|\/+$/g, "").split("/");

  const lastSegment = pathSegments[pathSegments.length - 1];
  const isLastSegmentNumber = !isNaN(parseFloat(lastSegment));
  const isLastSegmentDashboard = lastSegment === "dashboard";

  if (isLastSegmentNumber) {
    if (value !== "dashboard") {
      pathSegments.push(value);
    }
  } else if (isLastSegmentDashboard) {
    if (value !== "dashboard") {
      return;
    }
  } else {
    if (value === "dashboard") {
      pathSegments.pop();
    } else {
      pathSegments[pathSegments.length - 1] = value;
    }
  }

  return "/" + pathSegments.join("/");
};
