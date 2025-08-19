import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, InputAdornment, TextField, Toolbar, IconButton, Badge, MenuItem, Menu, ListItemIcon, ListItemText } from '@mui/material';
import { AccountCircle, Mail as MailIcon, Notifications as NotificationsIcon, MoreVert as MoreIcon } from '@mui/icons-material';
import Logo from '../../assets/images/logo-horizontal.svg';
import SearchIconNew from '../../assets/images/original/Contoso_Assets/Icons/image_search_icon.svg';
import WishlistIcon from '../../assets/images/original/Contoso_Assets/Icons/wishlist_icon.svg';
import ProfileIcon from '../../assets/images/original/Contoso_Assets/Icons/profile_icon.svg';
import BagIcon from '../../assets/images/original/Contoso_Assets/Icons/cart_icon.svg';
import UploadFile from '../uploadFile/uploadFile';
import { clickAction, submitAction } from '../../actions/actions';
import AuthB2CService from '../../services/authB2CService';
import logout_icon from "../../assets/images/original/Contoso_Assets/profile_page_assets/logout_icon.svg";
import personal_information_icon from "../../assets/images/original/Contoso_Assets/profile_page_assets/personal_information_icon.svg";
import my_wishlist_icon from "../../assets/images/original/Contoso_Assets/profile_page_assets/my_wishlist_icon.svg";
import my_address_book_icons from "../../assets/images/original/Contoso_Assets/profile_page_assets/my_address_book_icons.svg";
import my_orders_icon from "../../assets/images/original/Contoso_Assets/profile_page_assets/my_orders_icon.svg";
import { ProductService } from '../../services';
import { useSnackbar } from 'notistack';

const GrowDiv = styled('div')({
  flexGrow: 1,
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'red'
}));

const HeaderLogo = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const SearchBarDiv = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 50,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: 50,
    width: '50%',
    maxWidth: '650px',
    maxHeight: '48px',
  },
}));


// const SearchIcon = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

const SectionDesktop = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const SectionMobile = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    border: '1px solid #d3d4d5',
  }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:focus': {
    backgroundColor: '#fff',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: '#000',
    },
  },
  '&:hover': {
    backgroundColor: '#f8f8f8',
  }
}));

function TopAppBar(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [searchUpload, setSearchUpload] = useState(false);
  const authService = new AuthB2CService();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    if (searchUpload === true) {
      window.addEventListener('click', function (e) {
        if (!document.getElementById('searchbox').contains(e.target)) {
          setSearchUpload(false);
        }
      });
    }
  }, [searchUpload]);

  useEffect(() => {
    setSearchUpload(false)
  }, [location.pathname]);

  const redirectUrl = (url) => navigate(url);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMobileMenuOpen = (event) => setMobileMoreAnchorEl(event.currentTarget);

  const { loggedIn } = props.userInfo;
  const onClickLogout = () => {
    localStorage.clear();
    if (props.userInfo.isB2c) {
      authService.logout();
    }
    props.clickAction();
    navigate('/');
  };

  const setTextSearch = () => {
    if (searchRef.current.value.length > 0) {
      let searchData = searchRef.current.value;
      ProductService.getSearchResults(searchData)
        .then((relatedProducts) => {
          searchRef.current.value = '';
          if (relatedProducts.length > 1) {
            navigate("/suggested-products-list", {
              state: { relatedProducts },
            });
          } else if (relatedProducts.length === 1) {
            navigate(`/product/detail/${relatedProducts[0].id}`);
          } else {
            navigate("/suggested-products-list", {
              state: { relatedProducts },
            });
          }
        })
        .catch(() => {
          searchRef.current.value = '';
          enqueueSnackbar("There was an error, please try again", {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
            autoHideDuration: 6000,
          });
        });
    }
  };

  useEffect(() => {
    const listener = event => {
      if (searchRef.current.value.length > 0 && (event.code === "Enter" || event.code === "NumpadEnter")) {
        event.preventDefault();
        setTextSearch();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <StyledMenu
      id="profile-dropdown"
      anchorEl={anchorEl}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <StyledMenuItem onClick={() => redirectUrl('/profile/personal')}>
        <ListItemIcon>
          <img src={personal_information_icon} alt="" />
        </ListItemIcon>
        <ListItemText primary="Personal Information" />
        <ListItemIcon className='justify-content-end'></ListItemIcon>
      </StyledMenuItem>
      <StyledMenuItem onClick={() => redirectUrl('/profile/orders')}>
        <ListItemIcon>
          <img src={my_orders_icon} alt="" />
        </ListItemIcon>
        <ListItemText primary="My Orders" />
        <ListItemIcon className='justify-content-end'>
        </ListItemIcon>
      </StyledMenuItem>
      <StyledMenuItem onClick={() => redirectUrl('/profile/wishlist')}>
        <ListItemIcon>
          <img src={my_wishlist_icon} alt="" />
        </ListItemIcon>
        <ListItemText primary="My Wishlist" />
        <ListItemIcon className='justify-content-end'>
        </ListItemIcon>
      </StyledMenuItem>
      <StyledMenuItem onClick={() => redirectUrl('/profile/address')}>
        <ListItemIcon>
          <img src={my_address_book_icons} alt="" />
        </ListItemIcon>
        <ListItemText primary="My Address Book" />
        <ListItemIcon className='justify-content-end'>
        </ListItemIcon>
      </StyledMenuItem>
      <StyledMenuItem onClick={onClickLogout}>
        <ListItemIcon>
          <img src={logout_icon} alt="" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
        <ListItemIcon className='justify-content-end'>
        </ListItemIcon>
      </StyledMenuItem>
    </StyledMenu>
  );
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary" overlap="rectangular">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary" overlap="rectangular">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  return (
    <GrowDiv>
      <StyledAppBar className='appbar box-shadow-0' color='inherit' position="static">
        <Toolbar className='p-0'>
          <HeaderLogo className='headerLogo'>
            <Link to="/">
              <img src={Logo} alt="" />
            </Link>
          </HeaderLogo>
          <SearchBarDiv className="searchBar" id="searchbox">
            <TextField
              placeholder='Search by product name or search by image'
              variant="outlined"
              fullWidth
              onBlur={() => setTextSearch()}
              onChange={() => setSearchUpload(false)}
              onFocus={() => setSearchUpload(true)}
              inputRef={searchRef}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => searchRef.current.value.length === 0 ? setSearchUpload(!searchUpload) : null} className="searchBtn">
                      <img src={SearchIconNew} alt="iconimage" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {searchUpload ?
              <div className='searchbar-upload'>
                Search by an image
                <UploadFile
                  title=""
                  subtitle="Drag an image or upload a file"
                />
              </div>
              : null}
          </SearchBarDiv>
          <GrowDiv />
          {loggedIn && loggedIn &&
            <SectionDesktop>
              <IconButton className='iconButton' aria-label="show 4 new mails" color="inherit" onClick={() => redirectUrl('/profile/wishlist')}>
                <Badge badgeContent={0} color="secondary" overlap="rectangular">
                  <img src={WishlistIcon} alt="iconimage" />
                </Badge>
              </IconButton>
              <IconButton
                className='iconButton'
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <img src={ProfileIcon} alt="iconimage" />
              </IconButton>
              <IconButton className='iconButton' aria-label="show 17 new notifications" color="inherit" onClick={() => redirectUrl('/cart')} >
                <Badge badgeContent={1} color="secondary" overlap="rectangular">
                  <img src={BagIcon} alt="iconimage" />
                </Badge>
              </IconButton>
            </SectionDesktop>
          }
          <SectionMobile>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </SectionMobile>
        </Toolbar>
      </StyledAppBar>
      {renderMobileMenu}
      {renderMenu}
    </GrowDiv>
  );
}
const mapStateToProps = state => state.login;
export default connect(mapStateToProps, { clickAction, submitAction })(TopAppBar);