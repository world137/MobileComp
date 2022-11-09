import { slide as Menu } from 'react-burger-menu'

function SideBar() {
    var styles = {
        bmBurgerButton: {
            position: 'fixed',
            width: '36px',
            height: '30px',
            left: '36px',
            top: '36px'
        },
        bmBurgerBars: {
            background: '#373a47'
        },
        bmBurgerBarsHover: {
            background: '#a90000'
        },
        bmCrossButton: {
            height: '24px',
            width: '24px'
        },
        bmCross: {
            background: '#bdc3c7'
        },
        bmMenu: {
            background: '#373a47',
            padding: '2.5em 1.5em 0',
            fontSize: '1.15em',
            overflowY: 'hidden'
        },
        bmMorphShape: {
            fill: '#373a47'
        },
        bmItemList: {
            color: '#b8b7ad',
            padding: '0.8em'
        },
        bmItem: {
            display: 'inline-block'
        },
        bmOverlay: {
            background: 'rgba(0, 0, 0, 0.3)'
        }
    }

  return (
    <Menu styles={styles}>
      <div>
        <a id="main" style={{color: '#d94545', textDecoration: 'none'}} href="/main">Main</a><br/>
        <a id="credit" style={{color: '#d94545', textDecoration: 'none'}} href="/credit">Credit</a><br/>
        <a id="signout" style={{color: '#d94545', textDecoration: 'none'}} href="/signout">SignOut</a><br/>
      </div>
    </Menu>
  )
}
export default SideBar