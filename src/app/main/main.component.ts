import { filter } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';
import { MenuItems } from '../core/menu/menu-items/menu-items';
import { BreadcrumbService } from 'ng5-breadcrumb';
import { PageTitleService } from '../core/page-title/page-title.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TourService } from 'ngx-tour-md-menu';
import PerfectScrollbar from 'perfect-scrollbar';
import { AuthService } from '../service/auth-service/auth.service';
import { CoreService } from '../service/core/core.service';
declare var require: any

const screenfull = require('screenfull');

@Component({
	selector: 'gene-layout',
	templateUrl: './main-material.html',
	styleUrls: ['./main-material.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		'(window:resize)': 'onResize($event)'
	}
})

export class MainComponent implements OnInit, OnDestroy {

	currentUrl: any;
	root: any = 'ltr';
	layout: any = 'ltr';
	currentLang: any = 'en';
	customizerIn: boolean = false;
	showSettings: boolean = false;
	chatpanelOpen: boolean = false;
	sidenavOpen: boolean = true;
	isMobile: boolean = false;
	isFullscreen: boolean = false;
	collapseSidebarStatus: boolean;
	header: string;
	dark: boolean;
	compactSidebar: boolean;
	isMobileStatus: boolean;
	sidenavMode: string = 'side';
	popupDeleteResponse: any;
	sidebarColor: any;
	url: string;
	windowSize: number;
	private _routerEventsSubscription: Subscription;
	private _router: Subscription;
	@ViewChild('sidenav', { static: true }) sidenav;

	sideBarFilterClass: any = [
		{
			sideBarSelect: "sidebar-color-1",
			colorSelect: "sidebar-color-dark"
		},
		{
			sideBarSelect: "sidebar-color-2",
			colorSelect: "sidebar-color-primary",
		},
		{
			sideBarSelect: "sidebar-color-3",
			colorSelect: "sidebar-color-accent"
		},
		{
			sideBarSelect: "sidebar-color-4",
			colorSelect: "sidebar-color-warn"
		},
		{
			sideBarSelect: "sidebar-color-5",
			colorSelect: "sidebar-color-green"
		}
	]

	headerFilterClass: any = [
		{
			headerSelect: "header-color-1",
			colorSelect: "header-color-dark"
		},
		{
			headerSelect: "header-color-2",
			colorSelect: "header-color-primary"
		},
		{
			headerSelect: "header-color-3",
			colorSelect: "header-color-accent"
		},
		{
			headerSelect: "header-color-4",
			colorSelect: "header-color-warning"
		},
		{
			headerSelect: "header-color-5",
			colorSelect: "header-color-green"
		}
	]

	chatList: any[] = [
		{
			image: "assets/img/user-1.jpg",
			name: "John Smith",
			chat: "Lorem ipsum simply dummy",
			mode: "online"
		},
		{
			image: "assets/img/user-2.jpg",
			name: "Amanda Brown",
			chat: "Lorem ipsum simply dummy",
			mode: "online"
		},
		{
			image: "assets/img/user-3.jpg",
			name: "Justin Randolf",
			chat: "Lorem ipsum simply dummy",
			mode: "offline"
		},
		{
			image: "assets/img/user-4.jpg",
			name: "Randy SunSung",
			chat: "Lorem ipsum simply dummy",
			mode: "online"
		},
		{
			image: "assets/img/user-5.jpg",
			name: "Lisa Myth",
			chat: "Lorem ipsum simply dummy",
			mode: "online"
		},
	]

	constructor(public tourService: TourService,
		public menuItems: MenuItems,
		private breadcrumbService: BreadcrumbService,
		private pageTitleService: PageTitleService,
		public translate: TranslateService,
		private router: Router,
		private authService: AuthService,
		public coreService: CoreService,
		private routes: Router,
		private activatedRoute: ActivatedRoute) {

		router.events.subscribe((val) => {
			if (val instanceof NavigationEnd) {
				const url = this.router.url.split("/")[1].split("?")[0]
				if ((url != 'login') && (url != 'page-not-found'))
					this.authService.checkExpireSession().subscribe(() => { })
			}
		})

		const browserLang: string = translate.getBrowserLang();
		translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

		if (window.innerWidth > 1199) {
			this.tourService.start();
		}

		breadcrumbService.addFriendlyNameForRoute('/dashboard', 'Dashboard');
		breadcrumbService.addFriendlyNameForRoute('/dashboard/saas', 'SAAS');
		breadcrumbService.addFriendlyNameForRoute('/dashboard/web-analytics', 'Web Analytics');
		breadcrumbService.addFriendlyNameForRoute('/inbox', '');
		breadcrumbService.addFriendlyNameForRoute('/chat', '');
		breadcrumbService.addFriendlyNameForRoute('/calendar', '');
		breadcrumbService.addFriendlyNameForRoute('/taskboard', '');
		breadcrumbService.addFriendlyNameForRoute('/editor', 'Editor');
		breadcrumbService.addFriendlyNameForRoute('/video-player', 'Editor');
		breadcrumbService.addFriendlyNameForRoute('/editor/wysiwyg', 'Wysiwyg');
		breadcrumbService.addFriendlyNameForRoute('/editor/ckeditor', 'Ckeditor');
		breadcrumbService.addFriendlyNameForRoute('/icons', '');
		breadcrumbService.addFriendlyNameForRoute('/components', 'Components');
		breadcrumbService.addFriendlyNameForRoute('/components/buttons', 'Buttons');
		breadcrumbService.addFriendlyNameForRoute('/components/cards', 'Cards');
		breadcrumbService.addFriendlyNameForRoute('/components/grid', 'Grid');
		breadcrumbService.addFriendlyNameForRoute('/components/list', 'List');
		breadcrumbService.addFriendlyNameForRoute('/components/menu', 'Menu');
		breadcrumbService.addFriendlyNameForRoute('/components/slider', 'Slider');
		breadcrumbService.addFriendlyNameForRoute('/components/snackbar', 'Snackbar');
		breadcrumbService.addFriendlyNameForRoute('/components/dialog', 'Dialog');
		breadcrumbService.addFriendlyNameForRoute('/components/select', 'Select');
		breadcrumbService.addFriendlyNameForRoute('/components/input', 'Input');
		breadcrumbService.addFriendlyNameForRoute('/components/colorpicker', 'Colorpicker');
		breadcrumbService.addFriendlyNameForRoute('/checkbox', 'Checkbox');
		breadcrumbService.addFriendlyNameForRoute('/components/radio', 'Radio');
		breadcrumbService.addFriendlyNameForRoute('/components/toolbar', 'Toolbar');
		breadcrumbService.addFriendlyNameForRoute('/components/progress', 'Progress');
		breadcrumbService.addFriendlyNameForRoute('/components/tabs', 'Tabs');
		breadcrumbService.addFriendlyNameForRoute('/dragndrop', 'Drag and Drop');
		breadcrumbService.addFriendlyNameForRoute('/dragndrop/dragula', 'Dragula');
		breadcrumbService.addFriendlyNameForRoute('/dragndrop/sortable', 'SortableJS');
		breadcrumbService.addFriendlyNameForRoute('/chart', 'Charts');
		breadcrumbService.addFriendlyNameForRoute('/chart/ng2-charts', 'NG2 Charts');
		breadcrumbService.addFriendlyNameForRoute('/chart/easy-pie-chart', 'Easy Pie');
		breadcrumbService.addFriendlyNameForRoute('/tables', 'Table');
		breadcrumbService.addFriendlyNameForRoute('/tables/fullscreen', 'Full Screen');
		breadcrumbService.addFriendlyNameForRoute('/tables/selection', 'Selection');
		breadcrumbService.addFriendlyNameForRoute('/tables/pinning', 'Pinning');
		breadcrumbService.addFriendlyNameForRoute('/tables/sorting', 'Sorting');
		breadcrumbService.addFriendlyNameForRoute('/tables/Paging', 'Paging');
		breadcrumbService.addFriendlyNameForRoute('/tables/editing', 'Editing');
		breadcrumbService.addFriendlyNameForRoute('/tables/filter', 'Filter');
		breadcrumbService.addFriendlyNameForRoute('/tables/responsive', 'Responsive');
		breadcrumbService.addFriendlyNameForRoute('/forms', 'Forms');
		breadcrumbService.addFriendlyNameForRoute('/forms/form-wizard', 'Form Wizard');
		breadcrumbService.addFriendlyNameForRoute('/forms/form-validation', 'Form Validation');
		breadcrumbService.addFriendlyNameForRoute('/forms/form-upload', 'Form Upload');
		breadcrumbService.addFriendlyNameForRoute('/forms/form-tree', 'Tree');
		breadcrumbService.addFriendlyNameForRoute('/maps', 'Maps');
		breadcrumbService.addFriendlyNameForRoute('/maps/googlemap', 'Google Map');
		breadcrumbService.addFriendlyNameForRoute('/maps/leafletmap', 'Leaflet Map');
		breadcrumbService.addFriendlyNameForRoute('/pages', 'Pages');
		breadcrumbService.addFriendlyNameForRoute('/pages/media', 'Gallery');
		breadcrumbService.addFriendlyNameForRoute('/pages/pricing', 'Pricing');
		breadcrumbService.addFriendlyNameForRoute('/pages/blank', 'Blank');
		breadcrumbService.addFriendlyNameForRoute('/pages/mediaV2', 'Gallery V2');
		breadcrumbService.addFriendlyNameForRoute('/pages/pricing-1', 'Pricing-1');
		breadcrumbService.addFriendlyNameForRoute('/pages/timeline', 'Timeline');
		breadcrumbService.addFriendlyNameForRoute('/pages/faq', 'FAQ');
		breadcrumbService.addFriendlyNameForRoute('/pages/feedback', 'Feedback');
		breadcrumbService.addFriendlyNameForRoute('/pages/about', 'About');
		breadcrumbService.addFriendlyNameForRoute('/pages/contact', 'Contact');
		breadcrumbService.addFriendlyNameForRoute('/pages/search', 'Search');
		breadcrumbService.addFriendlyNameForRoute('/pages/comingsoon', 'Coming Soon');
		breadcrumbService.addFriendlyNameForRoute('/pages/maintenance', 'Maintenance');
		breadcrumbService.addFriendlyNameForRoute('/users', 'Users');
		breadcrumbService.addFriendlyNameForRoute('/users/userprofile', 'User Profile');
		breadcrumbService.addFriendlyNameForRoute('/users/userlist', 'User List');
		breadcrumbService.addFriendlyNameForRoute('/session', 'Session');
		breadcrumbService.addFriendlyNameForRoute('/login', 'Login');
		breadcrumbService.addFriendlyNameForRoute('/session/register', 'Register');
		breadcrumbService.addFriendlyNameForRoute('/session/forgot-password', 'Forgot');
		breadcrumbService.addFriendlyNameForRoute('/session/lockscreen', 'Lock Screen');
		breadcrumbService.addFriendlyNameForRoute('/courses', 'Courses');
		breadcrumbService.addFriendlyNameForRoute('/dashboard/courses', 'Courses');
		breadcrumbService.addFriendlyNameForRoute('/courses/courses-list', 'Courses List');
		breadcrumbService.addFriendlyNameForRoute('/courses/course-detail', 'Course Detail');
		breadcrumbService.addFriendlyNameForRoute('/courses/signin', 'Sign In');
		breadcrumbService.addFriendlyNameForRoute('/courses/payment', 'Payment');
		breadcrumbService.addFriendlyNameForRoute('/ecommerce', 'Ecommerce');
		breadcrumbService.addFriendlyNameForRoute('/ecommerce/shop', 'Shop');
		breadcrumbService.addFriendlyNameForRoute('/ecommerce/cart', 'Cart');
		breadcrumbService.addFriendlyNameForRoute('/ecommerce/checkout', 'Checkout');
		breadcrumbService.addFriendlyNameForRoute('/ecommerce/cards', 'Cards');
		breadcrumbService.addFriendlyNameForRoute('/ecommerce/invoice', 'Invoice');
		breadcrumbService.addFriendlyNameForRoute('/users/userprofilev2', 'User Profile V2');
		breadcrumbService.addFriendlyNameForRoute('/user-management', 'Management');
		breadcrumbService.addFriendlyNameForRoute('/user-management/usermanagelist', 'User List');
		breadcrumbService.addFriendlyNameForRoute('/user-management/usergridlist', 'User Grid');
		breadcrumbService.addFriendlyNameForRoute('/video-player', '');

		breadcrumbService.addFriendlyNameForRoute('/crypto', 'Crypto');
		breadcrumbService.addFriendlyNameForRoute('/dashboard/crypto', 'Crypto');
		breadcrumbService.addFriendlyNameForRoute('/crypto/marketcap', 'Market Cap');
		breadcrumbService.addFriendlyNameForRoute('/crypto/wallet', 'Wallet');
		breadcrumbService.addFriendlyNameForRoute('/crypto/trade', 'Trade');
		breadcrumbService.addFriendlyNameForRoute('/crm', 'CRM');
		breadcrumbService.addFriendlyNameForRoute('/crm/dasboard', 'Dasboard');
		breadcrumbService.addFriendlyNameForRoute('/crm/projects', 'Projects');
		breadcrumbService.addFriendlyNameForRoute('/crm/project-detail', 'Project Details');
		breadcrumbService.addFriendlyNameForRoute('/crm/clients', 'Clients');
		breadcrumbService.addFriendlyNameForRoute('/crm/reports', 'Reports');
		breadcrumbService.addFriendlyNameForRoute('/dashboard/crm', 'CRM');
		breadcrumbService.addFriendlyNameForRoute('/ecommerce/products', 'Products');
		breadcrumbService.addFriendlyNameForRoute('/ecommerce/edit-products', 'Edit Products');
		breadcrumbService.addFriendlyNameForRoute('/ecommerce/product-add', 'Product Add');
		breadcrumbService.addFriendlyNameForRoute('/crm/reports', 'Reports');
		breadcrumbService.addFriendlyNameForRoute('/crm/reports', 'Reports');

	}

	ngOnInit() {
		if ((this.router.url == '/dashboard/courses' || this.router.url === '/courses/courses-list' || this.router.url === '/courses/course-detail' || this.router.url === '/ecommerce/shop' || this.router.url === '/ecommerce/checkout' || this.router.url === '/ecommerce/invoice') && window.innerWidth < 1920) {
			this.coreService.sidenavOpen = false;
		}

		this.coreService.collapseSidebarStatus = this.coreService.collapseSidebar;
		this.pageTitleService.title.subscribe((val: string) => {
			this.header = val;
		});

		this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
			this.coreService.collapseSidebarStatus = this.coreService.collapseSidebar;
			this.url = event.url;
			this.customizeSidebar();
		});
		this.url = this.router.url;
		this.customizeSidebar();

		setTimeout(() => {
			this.windowSize = window.innerWidth;
			this.resizeSideBar();
		}, 0)


		this._routerEventsSubscription = this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd && this.isMobile) {
				this.sidenav.close();
			}
		});
	}

	ngOnDestroy() {
		this._router.unsubscribe();
	}

	/**
	  *As router outlet will emit an activate event any time a new component is being instantiated.
	  */
	onActivate(e, scrollContainer) {
		scrollContainer.scrollTop = 0;
	}

	/**
	  * toggleFullscreen method is used to show a template in fullscreen.
	  */
	toggleFullscreen() {
		if (screenfull.isEnabled) {
			screenfull.toggle();
			this.isFullscreen = !this.isFullscreen;
		}
	}

	/**
	  * customizerFunction is used to open and close the customizer.
	  */
	customizerFunction() {
		this.customizerIn = !this.customizerIn;
	}

	/**
	  * addClassOnBody method is used to add a add or remove class on body.
	  */
	addClassOnBody(event) {
		var body = document.body;
		if (event.checked) {
			body.classList.add("dark-theme-active");
		} else {
			body.classList.remove('dark-theme-active');
		}
	}

	/**
	  * changeRTL method is used to change the layout of template.
	  */
	changeRTL(isChecked) {
		if (isChecked) {
			this.layout = "rtl"
		}
		else {
			this.layout = "ltr"
		}
	}

	/**
	  * toggleSidebar method is used a toggle a side nav bar.
	  */
	toggleSidebar() {
		this.coreService.sidenavOpen = !this.coreService.sidenavOpen;
	}

	/**
	  * logOut method is used to log out the  template.
	  */
	logOut() {
		this.authService.deconnexion().subscribe(
			(res: any) => {
				this.authService.logOut();
			},
			(err) => {
				this.authService.logOut();
			  // this.showMessageError();
			}
		);
	}

	/**
	  * sidebarFilter function filter the color for sidebar section.
	  */
	sidebarFilter(selectedFilter) {
		for (var i = 0; i < this.sideBarFilterClass.length; i++) {
			document.getElementById('main-app').classList.remove(this.sideBarFilterClass[i].colorSelect);
			if (this.sideBarFilterClass[i].colorSelect == selectedFilter.colorSelect) {
				document.getElementById('main-app').classList.add(this.sideBarFilterClass[i].colorSelect);
			}
		}
		document.querySelector('.radius-circle').classList.remove('radius-circle');
		document.getElementById(selectedFilter.sideBarSelect).classList.add('radius-circle');
	}

	/**
	  * headerFilter function filter the color for header section.
	  */
	headerFilter(selectedFilter) {
		for (var i = 0; i < this.headerFilterClass.length; i++) {
			document.getElementById('main-app').classList.remove(this.headerFilterClass[i].colorSelect);
			if (this.headerFilterClass[i].colorSelect == selectedFilter.colorSelect) {
				document.getElementById('main-app').classList.add(this.headerFilterClass[i].colorSelect);
			}
		}
		document.querySelector('.radius-active').classList.remove('radius-active');
		document.getElementById(selectedFilter.headerSelect).classList.add('radius-active');
	}

	/**
	  * onChatOpen method is used to open a chat window.
	  */
	onChatOpen() {
		document.getElementById('chat-open').classList.toggle('show-chat-window');
	}

	/**
	  * onChatWindowClose method is used to close the chat window.
	  */
	chatWindowClose() {
		document.getElementById("chat-open").classList.remove("show-chat-window");
	}

	collapseSidebar(event) {
		document.getElementById('main-app').classList.toggle('collapsed-sidebar');
	}

	//onResize method is used to set the side bar according to window width.
	onResize(event) {
		this.windowSize = event.target.innerWidth;
		this.resizeSideBar();
	}

	//customizeSidebar method is used to change the side bar behaviour.
	customizeSidebar() {
		if ((this.url === '/dashboard/courses' || this.url === '/courses/courses-list' || this.url === '/courses/course-detail' || this.url === '/ecommerce/shop' || this.url === '/ecommerce/checkout' || this.url === '/ecommerce/invoice') && this.windowSize < 1920) {
			this.coreService.sidenavMode = 'over';
			this.coreService.sidenavOpen = false;
			if (!(document.getElementById('main-app').classList.contains('sidebar-overlay'))) {
				document.getElementById('main-app').className += " sidebar-overlay";
			}

		}
		else if ((window.innerWidth > 1200) && (this.url == '/dashboard/crypto' || this.url == '/crypto/marketcap' || this.url == '/crypto/wallet' || this.url == '/crypto/trade')) {
			this.collapseSidebarStatus = this.coreService.collapseSidebar;
			if ((this.collapseSidebarStatus == false) && (window.innerWidth > 1200)) {
				document.getElementById('main-app').className += ' collapsed-sidebar';
				this.coreService.collapseSidebar = true;
				this.coreService.sidenavOpen = true;
				this.coreService.sidenavMode = 'side';
				document.getElementById('main-app').classList.remove('sidebar-overlay');
			}
		}
		else if ((window.innerWidth > 1200) && !(this.url === '/dashboard/courses' || this.url === '/courses/courses-list' || this.url === '/courses/course-detail' || this.url === '/ecommerce/shop' || this.url === '/ecommerce/checkout' || this.url === '/ecommerce/invoice')) {
			this.coreService.sidenavMode = 'side';
			this.coreService.sidenavOpen = true;
			//for responsive
			var main_div = document.getElementsByClassName('app');
			for (let i = 0; i < main_div.length; i++) {
				if (main_div[i].classList.contains('sidebar-overlay')) {
					document.getElementById('main-app').classList.remove('sidebar-overlay');
				}
			}
		}
		//for responsive
		else if (window.innerWidth < 1200) {
			this.coreService.sidenavMode = 'over';
			this.coreService.sidenavOpen = false;
			var main_div = document.getElementsByClassName('app');
			for (let i = 0; i < main_div.length; i++) {
				if (!(main_div[i].classList.contains('sidebar-overlay'))) {
					document.getElementById('main-app').className += " sidebar-overlay";
				}
			}
		}
	}

	//To resize the side bar according to window width.
	resizeSideBar() {
		if (this.windowSize < 1200) {
			this.isMobileStatus = true;
			this.isMobile = this.isMobileStatus;
			this.coreService.sidenavMode = 'over';
			this.coreService.sidenavOpen = false;
			//for responsive
			var main_div = document.getElementsByClassName('app');
			for (let i = 0; i < main_div.length; i++) {
				if (!(main_div[i].classList.contains('sidebar-overlay'))) {
					if (document.getElementById('main-app')) {
						document.getElementById('main-app').className += " sidebar-overlay";
					}
				}
			}
		}
		else if ((this.url === '/dashboard/courses' || this.url === '/courses/courses-list' || this.url === '/courses/course-detail' || this.url === '/ecommerce/shop' || this.url === '/ecommerce/checkout' || this.url === '/ecommerce/invoice') && this.windowSize < 1920) {
			this.customizeSidebar();
		}
		else {
			this.isMobileStatus = false;
			this.isMobile = this.isMobileStatus;
			this.coreService.sidenavMode = 'side';
			this.coreService.sidenavOpen = true;
			//for responsive
			var main_div = document.getElementsByClassName('app');
			for (let i = 0; i < main_div.length; i++) {
				if (main_div[i].classList.contains('sidebar-overlay')) {
					document.getElementById('main-app').classList.remove('sidebar-overlay');
				}
			}
		}
	}
}


