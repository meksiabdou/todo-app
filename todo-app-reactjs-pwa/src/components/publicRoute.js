import {localization} from "../localization";

const PublicRoute = (Component) => {
  const Wrapper = (props) => {
    return <Component {...props} localization={localization("fr")} direction="ltr" />;
  };

  return Wrapper;
};

export default PublicRoute;
