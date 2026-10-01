import PeopleOutline from "@mui/icons-material/PeopleOutline";
import HandymanOutlined from "@mui/icons-material/HandymanOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import HomeWorkOutlined from "@mui/icons-material/HomeWorkOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import QueryStatsOutlined from "@mui/icons-material/QueryStatsOutlined";
import PublicOutlined from "@mui/icons-material/PublicOutlined";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
const icons = {
  people: PeopleOutline,
  handyman: HandymanOutlined,
  shipping: LocalShippingOutlined,
  home: HomeWorkOutlined,
  inventory: Inventory2Outlined,
  chart: QueryStatsOutlined,
  globe: PublicOutlined,
  arrow: ArrowForward,
  check: CheckCircleOutline,
};
export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Component = icons[name as keyof typeof icons] ?? CheckCircleOutline;
  return <Component className={className} fontSize="inherit" />;
}
