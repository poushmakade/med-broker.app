import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service';
import {
  BarChart2, Package, PackageSearch, Pill,
  Truck, TrendingUp, Wallet, ClipboardList,
	MessageSquare, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, Brain
} from 'lucide-react';
import './VendorLayout.css';

function VendorLayout({ children }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

	const menuSections = [
		{
			title: 'Operations',
			items: [
				{ path: '/vendor/dashboard', label: 'Dashboard', icon: <BarChart2 size={18} strokeWidth={1.5} />, hint: 'Business overview', description: 'Track sales, orders and stock alerts' },
				{ path: '/vendor/orders', label: 'Orders', icon: <Package size={18} strokeWidth={1.5} />, hint: 'Incoming demand', description: 'Process and update order statuses' },
				{ path: '/vendor/products', label: 'Inventory & Products', icon: <Pill size={18} strokeWidth={1.5} />, hint: 'Catalog & listings', description: 'Manage medicines, pricing, and stock details' }
			]
		},
		{
			title: 'AI Intelligence',
			items: [
				{ path: '/vendor/demand-forecasting', label: 'AI Demand Forecast', icon: <Brain size={18} strokeWidth={1.5} />, hint: 'Predictive ML Model', description: 'Sequence modeling & stockout prevention' }
			]
		},
		{
			title: 'Account',
			items: [
				{ path: '/vendor/settings', label: 'Settings', icon: <Settings size={18} strokeWidth={1.5} />, hint: 'Store controls', description: 'Update profile and notification settings' }
			]
		}
	];

	const menuItems = menuSections.flatMap((section) => section.items);

	const isActive = (path) => location.pathname === path;
	const activeMenuItem = menuItems.find((item) => isActive(item.path));

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth <= 768;
			setIsMobileView(mobile);
			if (!mobile) {
				setIsMobileMenuOpen(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (isMobileMenuOpen) {
			setIsMobileMenuOpen(false);
		}
	}, [location.pathname]);

	const handleToggleSidebar = () => {
		if (isMobileView) {
			setIsMobileMenuOpen(prev => !prev);
			return;
		}
		setIsCollapsed(prev => !prev);
	};

	const handleLogout = () => {
		authService.logout();
		navigate('/login');
	};

	return (
		<div className="vendor-layout">
			<button
				className="vendor-mobile-toggle"
				onClick={() => setIsMobileMenuOpen(true)}
				aria-label="Open vendor navigation"
			>
				<Menu size={20} strokeWidth={1.75} />
			</button>

			<div
				className={`vendor-sidebar-overlay ${isMobileMenuOpen ? 'show' : ''}`}
				onClick={() => setIsMobileMenuOpen(false)}
				aria-hidden={!isMobileMenuOpen}
			/>

			{/* Sidebar */}
			<aside className={`vendor-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'open' : ''}`}>
				{/* Sidebar Header */}
				<div className="vendor-sidebar-header">
					<button
						type="button"
						className="vendor-brand"
						onClick={() => navigate('/vendor/dashboard')}
						aria-label="Go to vendor dashboard"
						style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
					>
						<span className="topnav-logo-mark" aria-hidden="true">✚</span>
						{!isCollapsed && (
							<div className="vendor-brand-text">
								<span className="topnav-logo-word">
									<span className="topnav-logo-med">Pharma</span>
									<span className="topnav-logo-iq">Sense</span>
								</span>
								<span className="topnav-logo-trust">Vendor Console</span>
							</div>
						)}
					</button>
					<button
						onClick={handleToggleSidebar}
						className="vendor-sidebar-toggle"
						aria-label={isMobileView ? 'Close vendor navigation' : 'Toggle vendor sidebar'}
					>
						{isMobileView ? <X size={16} strokeWidth={1.75} /> : isCollapsed ? <ChevronRight size={16} strokeWidth={1.75} /> : <ChevronLeft size={16} strokeWidth={1.75} />}
					</button>
				</div>

				{/* Menu Items */}
				<nav className="vendor-sidebar-nav">
					{menuSections.map((section) => (
						<div key={section.title} className="vendor-sidebar-section">
							{!isCollapsed && (
								<p className="vendor-sidebar-section-title">{section.title}</p>
							)}
							{section.items.map(item => (
								<button
									key={item.path}
									onClick={() => navigate(item.path)}
									className={`vendor-menu-item ${isActive(item.path) ? 'active' : ''}`}
									aria-current={isActive(item.path) ? 'page' : undefined}
									title={isCollapsed ? item.label : undefined}
								>
									<span className="vendor-menu-item-icon">{item.icon}</span>
									{!isCollapsed && (
										<span className="vendor-menu-item-content">
											<span className="vendor-menu-item-label">{item.label}</span>
											<span className="vendor-menu-item-hint">{item.hint}</span>
										</span>
									)}
								</button>
							))}
						</div>
					))}
				</nav>
			</aside>

			{/* Main Content */}
			<main className={`vendor-main ${isCollapsed ? 'expanded' : ''}`}>
				<div className="vendor-utility-bar">
					<div className="vendor-utility-context">
						<p className="vendor-utility-title">{activeMenuItem?.label || 'Vendor Workspace'}</p>
						<p className="vendor-utility-subtitle">{activeMenuItem?.description || 'Manage your operations, inventory and business performance'}</p>
					</div>
					<div className="vendor-utility-actions">
						{authService.getUser()?.availableRoles?.includes('CUSTOMER') && (
							<button 
								type="button" 
								className="vendor-quick-action vendor-quick-action-secondary" 
								onClick={() => navigate('/customer/dashboard')}
							>
								Switch to Customer View
							</button>
						)}
						<button type="button" className="vendor-quick-action" onClick={() => navigate('/vendor/orders')}>Open Orders</button>
						<button type="button" className="vendor-quick-action" onClick={() => navigate('/vendor/stock')}>Manage Stock</button>
						<button
							type="button"
							className="vendor-quick-action vendor-quick-action-premium-logout"
							onClick={handleLogout}
						>
							<span aria-hidden="true"><LogOut size={18} strokeWidth={1.5} /></span> Logout
						</button>
					</div>
				</div>
				{children}
			</main>
		</div>
	);
}

export default VendorLayout;
