import React from 'react';
import ThemeToggle from './theme-toggle';
import Logo from './logo';
import Nav, { NavLink } from './nav';

const Header = () => {
  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-background/75 py-6 backdrop-blur-sm'>
      <nav className='container flex max-w-8xl items-center justify-between'>
        <Logo />
          <Nav>
            <NavLink href='/income'>Income</NavLink>
            <NavLink href='/expenditures'>Expenditures</NavLink>
            <NavLink href='/members'>Members</NavLink>
            <NavLink href='/reports'>Reports</NavLink>
          </Nav>
        <div>
          <ThemeToggle />
        </div>
      </nav>      
    </header>
  );
}

export default Header;