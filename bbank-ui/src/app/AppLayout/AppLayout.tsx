import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { NavLink } from 'react-router-dom';
import { routes } from '@app/routes';
import {BBankLoginPage} from '@app/BBankLoginPage/BBankLoginPage'
import bbankLogo from '../../images/logo.png';
import "@patternfly/react-core/dist/styles/base.css";
import '../../fonts.css';
import Keycloak from 'keycloak-js';

import { BBankAppLauncher } from '@app/UIComponent/BBankAppLauncher';


import {
  Avatar,
  Brand,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  Dropdown,
  DropdownGroup,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  Gallery,
  GalleryItem,
  KebabToggle,
  Nav,
  NavItem,
  NavList,
  Page,
  PageHeader,
  PageSection,
  PageSectionVariants,
  PageSidebar,
  SkipToContent,
  TextContent,
  Text,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem
} from '@patternfly/react-core';

import { css } from '@patternfly/react-styles';
import { BellIcon, CogIcon, HelpIcon } from '@patternfly/react-icons';
const imgBrand = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIwLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA3MDYuMyAxMzIuNSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNzA2LjMgMTMyLjUiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGZpbGw9IiMwMzAzMDMiIGQ9Ik0xOTcuMiw4My45VjQ4LjZoMTUuMmMyLjIsMCw0LjEsMC4zLDUuNiwxYzEuNSwwLjcsMi44LDEuNSwzLjcsMi42YzEsMS4xLDEuNiwyLjMsMi4xLDMuNgoJCWMwLjQsMS4zLDAuNiwyLjcsMC42LDRjMCwwLjktMC4xLDEuNy0wLjMsMi42Yy0wLjIsMC45LTAuNSwxLjctMC45LDIuNmMtMC40LDAuOC0wLjksMS42LTEuNiwyLjNjLTAuNiwwLjctMS40LDEuNC0yLjMsMS45CgkJYy0wLjksMC41LTEuOSwxLTMuMSwxLjNjLTEuMiwwLjMtMi41LDAuNS0zLjksMC41aC04LjN2MTNIMTk3LjJ6IE0yMTIuNyw2NC40YzAuOSwwLDEuNi0wLjEsMi4yLTAuNGMwLjYtMC4zLDEuMS0wLjYsMS40LTEuMQoJCWMwLjQtMC40LDAuNi0wLjksMC44LTEuNWMwLjItMC42LDAuMy0xLjEsMC4zLTEuN2MwLTAuNS0wLjEtMS0wLjItMS42Yy0wLjEtMC41LTAuNC0xLTAuNy0xLjVjLTAuNC0wLjUtMC44LTAuOC0xLjQtMS4xCgkJYy0wLjYtMC4zLTEuNC0wLjQtMi4zLTAuNGgtOC42djkuNEgyMTIuN3oiLz4KCTxwYXRoIGZpbGw9IiMwMzAzMDMiIGQ9Ik0yNzEuNiw4My45bC0yLjctNy4zaC0xMy42bC0yLjcsNy4zaC03LjNsMTMuNS0zNS40aDYuN2wxMy41LDM1LjRIMjcxLjZ6IE0yNjMuMiw2MS4yCgkJYy0wLjItMC40LTAuNC0wLjktMC42LTEuNWMtMC4yLTAuNi0wLjQtMS4xLTAuNS0xLjdjLTAuMSwwLjUtMC4zLDEuMS0wLjUsMS43Yy0wLjIsMC42LTAuNCwxLjEtMC42LDEuNWwtMy41LDkuMmg5LjJMMjYzLjIsNjEuMnoiCgkJLz4KCTxwYXRoIGZpbGw9IiMwMzAzMDMiIGQ9Ik0zMTcuMyw1NS4ydjI4LjhoLTYuOFY1NS4yaC0xMC4xdi02LjZoMjd2Ni42SDMxNy4zeiIvPgoJPHBhdGggZmlsbD0iIzAzMDMwMyIgZD0iTTM3MC4yLDU1LjJ2MjguOGgtNi44VjU1LjJoLTEwLjF2LTYuNmgyN3Y2LjZIMzcwLjJ6Ii8+Cgk8cGF0aCBmaWxsPSIjMDMwMzAzIiBkPSJNNDA4LjUsODMuOVY0OC42aDI0LjF2Ni41aC0xNy4zdjcuNGgxMC4ydjYuNWgtMTAuMnY4LjVoMTguNHY2LjVINDA4LjV6Ii8+Cgk8cGF0aCBmaWxsPSIjMDMwMzAzIiBkPSJNNDYyLjQsODMuOVY0OC42aDE2LjRjMi4yLDAsNC4xLDAuMyw1LjYsMC45YzEuNSwwLjYsMi43LDEuNCwzLjYsMi41YzAuOSwxLDEuNiwyLjIsMiwzLjUKCQljMC40LDEuMywwLjYsMi43LDAuNiw0LjJjMCwxLTAuMSwyLTAuNCwzYy0wLjMsMS0wLjcsMi0xLjMsMi45Yy0wLjYsMC45LTEuMywxLjgtMi4xLDIuNWMtMC45LDAuNy0xLjgsMS4zLTMsMS43bDYuOSwxNC4xSDQ4MwoJCWwtNi42LTEzLjJoLTcuMXYxMy4ySDQ2Mi40eiBNNDc4LjksNjQuM2MwLjksMCwxLjYtMC4xLDIuMi0wLjRjMC42LTAuMywxLjEtMC42LDEuNC0xYzAuNC0wLjQsMC42LTAuOSwwLjgtMS41CgkJYzAuMi0wLjYsMC4yLTEuMSwwLjItMS43YzAtMC42LTAuMS0xLjEtMC4yLTEuN2MtMC4xLTAuNi0wLjQtMS0wLjctMS41Yy0wLjMtMC40LTAuOC0wLjgtMS40LTFjLTAuNi0wLjMtMS40LTAuNC0yLjMtMC40aC05Ljd2OS4yCgkJSDQ3OC45eiIvPgoJPHBhdGggZmlsbD0iIzAzMDMwMyIgZD0iTTU0MS45LDgzLjlsLTE0LTIwLjZjLTAuMi0wLjMtMC41LTAuOC0wLjgtMS4zYy0wLjMtMC41LTAuNS0xLTAuNy0xLjRjMC4xLDAuNCwwLjEsMC44LDAuMSwxLjMKCQljMCwwLjUsMCwxLDAsMS4zdjIwLjZoLTYuOFY0OC42aDYuNGwxMy43LDIwLjRjMC4yLDAuMywwLjUsMC43LDAuNywxLjJjMC4zLDAuNSwwLjUsMSwwLjcsMS40YzAtMC41LTAuMS0xLTAuMS0xLjQKCQljMC0wLjUsMC0wLjksMC0xLjJWNDguNmg2Ljh2MzUuNEg1NDEuOXoiLz4KCTxwYXRoIGZpbGw9IiMwMzAzMDMiIGQ9Ik01NzguNCw4My45VjQ4LjZoMjMuN3Y2LjVoLTE2Ljl2Ny40SDU5NnY2LjVoLTEwLjd2MTVINTc4LjR6Ii8+Cgk8cGF0aCBmaWxsPSIjMDMwMzAzIiBkPSJNNjI5LjgsODMuOVY0OC42aDYuOHYyOC44aDE3LjF2Ni42SDYyOS44eiIvPgoJPHBhdGggZmlsbD0iIzAzMDMwMyIgZD0iTTY4Ni40LDgzLjlWNzAuMmwtMTMuMS0yMS42aDcuN2w4LjcsMTQuNWw4LjctMTQuNWg3LjdsLTEzLjEsMjEuNnYxMy44SDY4Ni40eiIvPgo8L2c+CjxnPgoJPHBhdGggZmlsbD0iIzAzMDMwMyIgZD0iTTQ5LDEwM2wtMjEuMiw0LjlMMCw2OC40TDcwLDBsNzAsNjguNGwtMjcuOCwzOS40TDkxLDEwM2wtMjEsMjkuNUw0OSwxMDN6IE03MCwxMjguN2wxOC42LTI2LjJsLTcuMi0xLjcKCQlsLTExLDE2LjJsLTExLjktMTYuMmwtNy4yLDEuN0w3MCwxMjguN3ogTTcwLjQsMTEzLjFsOS4yLTEzLjVMNzAsNi43bC05LjUsOTIuOUw3MC40LDExMy4xeiBNMjguOCwxMDUuNGwxOC44LTQuM0wzMy44LDgxLjcKCQlsNC4xLTkuM0wyNS4yLDU1TDU4LDE0LjlMMi45LDY4LjdMMjguOCwxMDUuNHogTTExMS4yLDEwNS40bDE2LjMtMjMuMWw5LjYtMTMuNkw4MiwxNC45TDExNC45LDU1bC0xMi44LDE3LjRsNC4xLDkuM0w5Mi40LDEwMQoJCUwxMTEuMiwxMDUuNHogTTkwLjEsMTAwLjVsMTMuNi0xOS4xbC0zLTYuOUw4Mi43LDk4LjhMOTAuMSwxMDAuNXogTTUwLDEwMC41bDcuMy0xLjdMMzkuNCw3NC41bC0zLDYuOUw1MCwxMDAuNXogTTgxLjksOTYuMgoJCWwxNy42LTI0LjFMNzIuOSwxMS42TDgxLjksOTYuMnogTTU4LjEsOTYuMmw5LTg0LjZMNDAuNSw3Mi4xTDU4LjEsOTYuMnogTTM5LDcwTDY2LjEsOC41TDI4LDU1LjFMMzksNzB6IE0xMDEuMSw3MGwxMS0xNUw3NCw4LjUKCQlMMTAxLjEsNzB6Ii8+CjwvZz4KPC9zdmc+Cg==";
const imgAvatar = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzNiAzNiIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+CgkvKnN0eWxlbGludC1kaXNhYmxlKi8KCS5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsdGVyOnVybCgjYik7fQoJLnN0MnttYXNrOnVybCgjYSk7fQoJLnN0M3tmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiNCQkJCQkI7fQoJLnN0NHtvcGFjaXR5OjAuMTtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDV7b3BhY2l0eTo4LjAwMDAwMGUtMDI7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojMjMxRjIwO2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7fQoJLypzdHlsZWxpbnQtZW5hYmxlKi8KPC9zdHlsZT4KCQkJPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMTgiIGN5PSIxOC41IiByPSIxOCIvPgoJCTxkZWZzPgoJCQk8ZmlsdGVyIGlkPSJiIiB4PSI1LjIiIHk9IjcuMiIgd2lkdGg9IjI1LjYiIGhlaWdodD0iNTMuNiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KCQkJCTxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMSAwIDAgMCAwICAwIDEgMCAwIDAgIDAgMCAxIDAgMCAgMCAwIDAgMSAwIi8+CgkJCTwvZmlsdGVyPgoJCTwvZGVmcz4KCQk8bWFzayBpZD0iYSIgeD0iNS4yIiB5PSI3LjIiIHdpZHRoPSIyNS42IiBoZWlnaHQ9IjUzLjYiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiPgoJCQk8ZyBjbGFzcz0ic3QxIj4KCQkJCTxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjE4IiBjeT0iMTguNSIgcj0iMTgiLz4KCQkJPC9nPgoJCTwvbWFzaz4KCQk8ZyBjbGFzcz0ic3QyIj4KCQkJPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS4wNCA2Ljg4KSI+CgkJCQk8cGF0aCBjbGFzcz0ic3QzIiBkPSJtMjIuNiAxOC4xYy0xLjEtMS40LTIuMy0yLjItMy41LTIuNnMtMS44LTAuNi02LjMtMC42LTYuMSAwLjctNi4xIDAuNyAwIDAgMCAwYy0xLjIgMC40LTIuNCAxLjItMy40IDIuNi0yLjMgMi44LTMuMiAxMi4zLTMuMiAxNC44IDAgMy4yIDAuNCAxMi4zIDAuNiAxNS40IDAgMC0wLjQgNS41IDQgNS41bC0wLjMtNi4zLTAuNC0zLjUgMC4yLTAuOWMwLjkgMC40IDMuNiAxLjIgOC42IDEuMiA1LjMgMCA4LTAuOSA4LjgtMS4zbDAuMiAxLTAuMiAzLjYtMC4zIDYuM2MzIDAuMSAzLjctMyAzLjgtNC40czAuNi0xMi42IDAuNi0xNi41YzAuMS0yLjYtMC44LTEyLjEtMy4xLTE1eiIvPgoJCQkJPHBhdGggY2xhc3M9InN0NCIgZD0ibTIyLjUgMjZjLTAuMS0yLjEtMS41LTIuOC00LjgtMi44bDIuMiA5LjZzMS44LTEuNyAzLTEuOGMwIDAtMC40LTQuNi0wLjQtNXoiLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Im0xMi43IDEzLjJjLTMuNSAwLTYuNC0yLjktNi40LTYuNHMyLjktNi40IDYuNC02LjQgNi40IDIuOSA2LjQgNi40LTIuOCA2LjQtNi40IDYuNHoiLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDUiIGQ9Im05LjQgNi44YzAtMyAyLjEtNS41IDQuOS02LjMtMC41LTAuMS0xLTAuMi0xLjYtMC4yLTMuNSAwLTYuNCAyLjktNi40IDYuNHMyLjkgNi40IDYuNCA2LjRjMC42IDAgMS4xLTAuMSAxLjYtMC4yLTIuOC0wLjYtNC45LTMuMS00LjktNi4xeiIvPgoJCQkJPHBhdGggY2xhc3M9InN0NCIgZD0ibTguMyAyMi40Yy0yIDAuNC0yLjkgMS40LTMuMSAzLjVsLTAuNiAxOC42czEuNyAwLjcgMy42IDAuOWwwLjEtMjN6Ii8+CgkJCTwvZz4KCQk8L2c+Cjwvc3ZnPgo=";

interface IAppLayout {
  children: React.ReactNode; 
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({children}) => {

  const [isNavOpen, setIsNavOpen] = React.useState(true);
  const [isMobileView, setIsMobileView] = React.useState(true);
  const [isNavOpenMobile, setIsNavOpenMobile] = React.useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const [isDropdownSelect, setIsDropdownSelect] = React.useState(false);



  const [isKebabDropdownOpen, setIsKebabDropdownOpen] = React.useState(false);


  const [activeItem, setActiveItem] = React.useState(0);

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

   



    const onNavToggleMobile = () => {
      setIsNavOpenMobile(!isNavOpenMobile);
    };
    const onNavToggle = () => {
      setIsNavOpen(!isNavOpen);
    }
    const onPageResize = (props: { mobileView: boolean; windowSize: number }) => {
      setIsMobileView(props.mobileView);
    };


    const onDropdownToggle = () => {
      console.log("onDropdownToggle "+ isDropdownOpen);

        setIsDropdownOpen(!isDropdownOpen);
    };

    const onDropdownSelect = () => {
      console.log("onDropdownSelect "+ isDropdownOpen);

        setIsDropdownOpen(!isDropdownOpen);
    };

    const onKebabDropdownToggle =  () => {
        console.log("onKebabDropdownToggle "+ isKebabDropdownOpen);
        setIsKebabDropdownOpen(!isKebabDropdownOpen);
    };

    const onKebabDropdownSelect = () => {
      console.log("onKebabDropdownSelect "+ isKebabDropdownOpen);
      setIsKebabDropdownOpen(!isKebabDropdownOpen);
    };

    const onNavSelect = (result) => {
      console.log("onNavSelect "+ result.itemId);

        setActiveItem(result.itemId);
    };


    const PageNav = (
      <Nav onSelect={onNavSelect} aria-label="Nav" id="nav-primary-simple" theme="dark">
        <NavList id="nav-list-simple">
        {routes.map((route, idx) => route.label && (
            <NavItem key={`${route.label}-${idx}`} id={`${route.label}-${idx}`}>
              <NavLink exact to={route.path} activeClassName="pf-m-current">{route.label}</NavLink>
            </NavItem>
          ))}
      </NavList>
      </Nav>
    );
    // const kebabDropdownItems = [
    //   <DropdownItem key="settings">
    //     <CogIcon /> Settings
    //   </DropdownItem>,
    //   <DropdownItem key="help">
    //     <HelpIcon /> Help
    //   </DropdownItem>
    // ];
    // const userDropdownItems = [
    //   <DropdownGroup key="group 2">
    //     <DropdownItem key="group 2 profile">My profile</DropdownItem>
    //     <DropdownItem key="group 2 user" component="button">
    //       User management
    //     </DropdownItem>
    //     <DropdownItem key="group 2 logout">Logout</DropdownItem>
    //   </DropdownGroup>
    // ];
    // let profile = JSON.parse(localStorage.getItem('profile'));
    // console.log("profile in applyout"+JSON.stringify(profile, null, "  "));    
    // const headerTools = (
    //   <PageHeaderTools>
    //     <PageHeaderToolsGroup
    //       visibility={{
    //         default: 'hidden',
    //         lg: 'visible'
    //       }} /** the settings and help icon buttons are only visible on desktop sizes and replaced by a kebab dropdown for other sizes */
    //     >
    //       <PageHeaderToolsItem>
    //         <Button aria-label="Settings actions" variant={ButtonVariant.plain}>
    //           <CogIcon />
    //         </Button>
    //       </PageHeaderToolsItem>
    //       <PageHeaderToolsItem>
    //         <Button aria-label="Help actions" variant={ButtonVariant.plain}>
    //           <HelpIcon />
    //         </Button>
    //       </PageHeaderToolsItem>
    //     </PageHeaderToolsGroup>
    //     <PageHeaderToolsGroup>
    //       <PageHeaderToolsItem
    //         visibility={{
    //           lg: 'hidden'
    //         }} /** this kebab dropdown replaces the icon buttons and is hidden for desktop sizes */
    //       >
    //         <Dropdown
    //           isPlain
    //           position="right"
    //           onSelect={onKebabDropdownSelect}
    //           toggle={<KebabToggle onToggle={onKebabDropdownToggle} />}
    //           isOpen={isKebabDropdownOpen}
    //           dropdownItems={kebabDropdownItems}
    //         />
    //       </PageHeaderToolsItem>
    //       <PageHeaderToolsItem
    //         visibility={{ default: 'hidden', md: 'visible' }} /** this user dropdown is hidden on mobile sizes */
    //       >
    //         <Dropdown
    //           isPlain
    //           position="right"
    //           onSelect={onDropdownSelect}
    //           isOpen={isDropdownOpen}
    //           toggle={<DropdownToggle onToggle={onDropdownToggle}>{profile.firstName} {profile.lastName}</DropdownToggle>}
    //           dropdownItems={userDropdownItems}
    //         />
    //       </PageHeaderToolsItem>
    //     </PageHeaderToolsGroup>
    //     <Avatar src={imgAvatar} alt="Avatar image" />
    //   </PageHeaderTools>
    // );

   /* const Header = (
      <PageHeader
        logo={<Brand src={bbankLogo} alt="BBank Logo" />} 
        headerTools={headerTools} 
        showNavToggle     
        isNavOpen={isNavOpen}
        onNavToggle={isMobileView ? onNavToggleMobile : onNavToggle}
      />
    );*/

    const Header = (
      <PageHeader
        logo={<Brand src={bbankLogo} alt="BBank Logo" />}         
        showNavToggle
        isNavOpen={isNavOpen}
        onNavToggle={isMobileView ? onNavToggleMobile : onNavToggle}
        headerTools={<BBankAppLauncher/>}
      />
    );
  

    const Sidebar = (
      <PageSidebar
        theme="dark"
        nav={PageNav}
        isNavOpen={isMobileView ? isNavOpenMobile : isNavOpen}
     />
    );

    const PageSkipToContent = (
      <SkipToContent href="#primary-app-container">
        Skip to Content
      </SkipToContent>
    );
    
    // const keycloak = Keycloak( {url: 'http://localhost:8080/auth', realm: 'bbank-apps', clientId: 'bbank-ui'});
    // keycloak.init({onLoad: 'login-required'}).then(authenticated => {
    //   setKeycloak(keycloak);
    //   setIsAuthenticated(authenticated);
    //   ReactDOM.render(
      return(
            <Page
                  mainContainerId={"primary-app-container"}
                  header={Header}
                  sidebar={Sidebar}
                  skipToContent={PageSkipToContent}>
                  {children}
            </Page> 
          );
        // })
        //   .error(error => console.log(error));
}
export { AppLayout };