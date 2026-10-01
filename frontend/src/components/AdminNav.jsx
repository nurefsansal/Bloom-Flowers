import { NavLink } from 'react-router-dom';
import './AdminNav.css';

function AdminNav() {
  return (
    <nav className="admin-nav">
      <NavLink
        to="/admin/products"
        className={({ isActive }) =>
          isActive ? 'admin-nav-link active' : 'admin-nav-link'
        }
      >
        Ürünler
      </NavLink>

      <NavLink
        to="/admin/categories"
        className={({ isActive }) =>
          isActive ? 'admin-nav-link active' : 'admin-nav-link'
        }
      >
        Kategoriler
      </NavLink>

      <NavLink
        to="/admin/orders"
        className={({ isActive }) =>
          isActive ? 'admin-nav-link active' : 'admin-nav-link'
        }
      >
        Siparişler
      </NavLink>
    </nav>
  );
}

export default AdminNav;