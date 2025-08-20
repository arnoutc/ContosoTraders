import React, { Component, Fragment } from "react";
import { Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { CartService } from "./services";
import Meeting from './pages/home/components/videoCall/Meeting';
import { Header, Footer, Appbar, HeaderMessage } from "./shared";
import {
  Home,
  List,
  MyCoupons,
  Detail,
  SuggestedProductsList,
  Profile,
  ShoppingCart,
  Arrivals,
  RefundPolicy,
  TermsOfService,
  AboutUs,
  ErrorPage,
  Cart,
} from "./pages";
import "./i18n";
import "./main.scss";
import warningIcon from './assets/images/original/Contoso_Assets/Icons/information_icon.svg'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shoppingCart: [],
      quantity: null,
    };
  }
  async componentDidMount() {
    if (this.props.userInfo.token) {
      const shoppingCart = await CartService.getShoppingCart(
        this.props.userInfo.token
      );
      if (shoppingCart) {
        this.setState({ shoppingCart });
      }
    }
    if (this.state.shoppingCart != null) {
      const quantity = this.state.shoppingCart.reduce(
        (oldQty, { qty }) => oldQty + qty,
        0
      );
      this.setState({ quantity });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // location comes from wrapper now
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }
  ShoppingCart = (quantity) => {
    this.setState({ quantity });
  };
  sumProductInState = () => {
    this.setState((prevState) => {
      return { quantity: prevState.quantity + 1 };
    });
  };

  // PrivateRoute logic for v6
  requireAuth = (element) => {
    return this.props.userInfo.loggedIn === true ? element : <Navigate to="/" />;
  };

  render() {
    const { quantity } = this.state;

    const detailProps = {
      sumProductInState: this.sumProductInState
    };

    return (
      <div className="App">
        <Fragment>
          <div className="mainHeader">
            <HeaderMessage type="warning" icon={warningIcon} message="This Is A Demo Store For Testing Purposes — No Orders Shall Be Fulfilled." />
            <Appbar quantity={quantity} />
            {this.props.location.pathname === '/' || this.props.location.pathname === '/new-arrivals'
              ? <Header quantity={quantity} />
              : <div id="box"></div>}
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-arrivals" element={<Arrivals />} />
            <Route path="/meeting" element={<Meeting />} />
            <Route path="/list" element={<List />} />
            <Route path="/list/:code" element={<List />} />
            <Route path="/suggested-products-list" element={<SuggestedProductsList />} />
            <Route
              path="/product/detail/:productId"
              element={<Detail {...detailProps} />}
            />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/coupons" element={this.requireAuth(<MyCoupons />)} />
            <Route path="/profile/:page" element={this.requireAuth(<Profile />)} />
            <Route path="/cart" element={this.requireAuth(<Cart />)} />
            <Route
              path="/shopping-cart"
              element={this.requireAuth(<ShoppingCart ShoppingCart={this.ShoppingCart} quantity={this.state.quantity} />)}
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <Footer />
        </Fragment>
      </div>
    );
  }
}

const mapStateToProps = (state) => state.login;

function AppWrapper(props) {
  const location = useLocation();
  const navigate = useNavigate();
  return <App {...props} location={location} navigate={navigate} />;
}

export default connect(mapStateToProps)(AppWrapper);