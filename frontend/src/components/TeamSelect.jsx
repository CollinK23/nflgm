import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { useSelector, useDispatch } from "react-redux";
import { addLeague } from "../features/user/userSlice";
import { useNavigate, useLocation } from "react-router-dom";

export default function TeamSelect() {
  const dispatch = useDispatch();
  const leagues = useSelector((state) => state.user.leagues);
  const espnId = useSelector((state) => state.user.userId);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLeague, setSelectedLeague] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/leagues/${espnId}`);
      const data = await response.json();
      dispatch(addLeague(data));

      console.log(leagues);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const pathSegments = location.pathname.replace(/^\/+|\/+$/g, "").split("/");
    setSelectedLeague(
      pathSegments.length > 2 ? `${pathSegments[1]}/${pathSegments[2]}` : null
    );
  }, [location.pathname, espnId]);

  const pages = ["roster", "trade", "compare"];

  const handleChange = (value) => {
    const pathSegments = location.pathname.replace(/^\/+|\/+$/g, "").split("/");
    if (
      !isNaN(parseFloat(pathSegments[pathSegments.length - 1])) &&
      pathSegments[pathSegments.length - 1].length > 3
    ) {
      pathSegments[pathSegments.length - 1] = value;
    } else if (!isNaN(parseFloat(pathSegments[pathSegments.length - 1]))) {
      pathSegments[pathSegments.length - 2] = value;
      pathSegments.pop();
    } else if (pages.includes(pathSegments[pathSegments.length - 1])) {
      const newDirs = value.split("/");
      pathSegments[1] = newDirs[0];
      pathSegments[2] = newDirs[1];
    } else {
      pathSegments.push(value);
    }
    const newPath = pathSegments.join("/");
    navigate(`/${newPath}`);
  };

  return (
    <Select onValueChange={handleChange} value={selectedLeague}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a League" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {leagues.map((item) => {
            return (
              <SelectItem value={`${item.groupId}/${item.teamId}`}>
                {item.groupName.length > 15
                  ? `${item.groupName.slice(0, 15)}...`
                  : item.groupName}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
