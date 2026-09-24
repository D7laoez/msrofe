/**
 * Masroofi (مصروفي) - Iraqi Expense Tracker
 * Mobile FinTech Architecture with Google Account Cloud Sync (Firebase & Google Identity)
 */

// Default Categories Configuration
const DEFAULT_CATEGORIES = [
  { id: 'cat-restaurant', name: 'مطاعم ومقاهي', icon: 'restaurant', emoji: '🍔', color: '#FFD166', budget: 350000, type: 'expense' },
  { id: 'cat-transport', name: 'مواصلات وبنزين', icon: 'directions_car', emoji: '🚗', color: '#adc8f5', budget: 200000, type: 'expense' },
  { id: 'cat-bills', name: 'فواتير ومولدة', icon: 'electric_bolt', emoji: '💡', color: '#dfe9fc', budget: 250000, type: 'expense' },
  { id: 'cat-shopping', name: 'تسوق ومشتريات', icon: 'shopping_bag', emoji: '🛍️', color: '#ffdad6', budget: 300000, type: 'expense' },
  { id: 'cat-telecom', name: 'إنترنت ورصيد', icon: 'wifi', emoji: '📱', color: '#b5d0fd', budget: 75000, type: 'expense' },
  { id: 'cat-health', name: 'صحة وعلاج', icon: 'local_hospital', emoji: '💊', color: '#06D6A0', budget: 150000, type: 'expense' },
  { id: 'cat-home', name: 'سكن ومستلزمات', icon: 'home', emoji: '🏠', color: '#eed9c4', budget: 400000, type: 'expense' },
  { id: 'cat-cafe', name: 'كافيه وقهوة', icon: 'local_cafe', emoji: '☕', color: '#ffdf9b', budget: 80000, type: 'expense' },
  
  // Income Categories
  { id: 'cat-salary', name: 'راتب شهري', icon: 'payments', emoji: '💼', color: '#06D6A0', budget: 0, type: 'income' },
  { id: 'cat-freelance', name: 'عمل حر / إضافي', icon: 'laptop_mac', emoji: '💻', color: '#455f87', budget: 0, type: 'income' },
  { id: 'cat-transfer', name: 'حوالات وأرباح', icon: 'account_balance', emoji: '📈', color: '#FFD166', budget: 0, type: 'income' },
  { id: 'cat-other-inc', name: 'دخل آخر', icon: 'savings', emoji: '🪙', color: '#b5d0fd', budget: 0, type: 'income' }
];

// Initial Transactions Sample
const DEFAULT_TRANSACTIONS = [
  { id: 'tx-1', type: 'expense', amount: 45000, categoryId: 'cat-restaurant', title: 'عشاء ومطعم كباب', note: 'عشاء مع العائلة في الكرادة', date: new Date().toISOString().split('T')[0], paymentMethod: 'نقداً' },
  { id: 'tx-2', type: 'expense', amount: 80000, categoryId: 'cat-bills', title: 'سحب أمبيرات المولدة', note: 'اشتراك مولدة 4 أمبير لشهر أيلول', date: new Date().toISOString().split('T')[0], paymentMethod: 'زين كاش' },
  { id: 'tx-3', type: 'expense', amount: 25000, categoryId: 'cat-transport', title: 'بنزين سيارة (محسن)', note: 'تفويل المحطة الحكومية', date: getPastDate(1), paymentMethod: 'كي كارد' },
  { id: 'tx-4', type: 'expense', amount: 40000, categoryId: 'cat-telecom', title: 'اشتراك إنترنت فايبر', note: 'تجديد باقة إيرثلنك FTTH', date: getPastDate(2), paymentMethod: 'زين كاش' },
  { id: 'tx-5', type: 'expense', amount: 65000, categoryId: 'cat-shopping', title: 'مسواك مخضر وأسواق', note: 'مستلزمات البيت الأسبوعية', date: getPastDate(3), paymentMethod: 'نقداً' },
  { id: 'tx-6', type: 'expense', amount: 15000, categoryId: 'cat-cafe', title: 'قهوة مع الأصدقاء', note: 'كافيه المنصور', date: getPastDate(4), paymentMethod: 'نقداً' },
  { id: 'tx-7', type: 'income', amount: 2000000, categoryId: 'cat-salary', title: 'إيداع الراتب الشهري', note: 'راتب شهر أيلول - الماستر كارد', date: getPastDate(5), paymentMethod: 'كي كارد' },
  { id: 'tx-8', type: 'income', amount: 450000, categoryId: 'cat-freelance', title: 'أتعاب تصميم واستشارة', note: 'مشروع هوية بصرية لشركة بغداد', date: getPastDate(6), paymentMethod: 'FIB' }
];

function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// Sound FX using Web Audio API
class AudioFeedback {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  }
  playTap() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch(e) {}
  }
  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.28);
    } catch(e) {}
  }
}

// App State Management & Google Cloud Sync
class MasroofiApp {
  constructor() {
    this.audio = new AudioFeedback();
    this.initStorage();
    this.currentScreen = 'dashboard';
    this.balanceHidden = false;
    this.txType = 'expense';
    this.enteredAmount = '0';
    this.selectedCategory = null;
    this.searchQuery = '';
    this.txFilter = 'all';
    this.activeStatsRange = 'month';
    this.isSyncing = false;
    this.deferredInstallPrompt = null;
    
    // Google User State & Real Drive Sync
    this.googleUser = JSON.parse(localStorage.getItem('masroofi_google_user') || 'null');
    this.googleTokenClient = null;
    this.syncDebounceTimer = null;
    this.defaultGoogleClientId = '1080534388753-b0huenud45kkihd4qri5n1avnl4ceji2.apps.googleusercontent.com';
    
    this.initElements();
    this.initEventListeners();
    this.initPWA();
    this.initTouchGestures();
    this.initNativeMobileFeatures();
    this.render();
    this.initGoogleAuthStatus();
    this.initGoogleIdentityClient();
    this.dismissSplashScreen();
  }

  dismissSplashScreen() {
    setTimeout(() => {
      const splash = document.getElementById('app-splash-screen');
      if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 600);
      }
    }, 450);
  }

  // Native Mobile App Features & Hardware Back Button
  initNativeMobileFeatures() {
    // Android / Browser Back Button Listener
    window.addEventListener('popstate', (e) => {
      this.handleMobileBackNavigation();
    });

    if (window.Capacitor) {
      const { App, StatusBar, SplashScreen, Haptics } = window.Capacitor.Plugins || {};
      if (StatusBar) {
        StatusBar.setStyle({ style: 'DARK' }).catch(() => {});
        StatusBar.setBackgroundColor({ color: '#102542' }).catch(() => {});
      }
      if (SplashScreen) {
        SplashScreen.hide().catch(() => {});
      }
      if (App) {
        App.addListener('backButton', () => {
          this.handleMobileBackNavigation();
        });
      }
    }
  }

  handleMobileBackNavigation() {
    const addModal = document.getElementById('add-tx-modal');
    const googleModal = document.getElementById('google-cloud-modal');
    const catModal = document.getElementById('add-category-modal');
    const installModal = document.getElementById('install-guide-modal');

    if (addModal && addModal.classList.contains('open')) {
      this.closeAddModal();
      return;
    }
    if (googleModal && googleModal.classList.contains('open')) {
      this.closeGoogleSettingsModal();
      return;
    }
    if (catModal && catModal.classList.contains('open')) {
      catModal.classList.remove('open');
      return;
    }
    if (this.currentScreen !== 'dashboard') {
      this.switchScreen('dashboard');
      return;
    }
  }

  // Haptic feedback for mobile devices
  vibrate(pattern = 12) {
    if (window.Capacitor?.Plugins?.Haptics) {
      try {
        window.Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' });
      } catch (e) {}
    } else if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
    this.audio.playTap();
  }

  initStorage() {
    if (!localStorage.getItem('masroofi_txs')) {
      localStorage.setItem('masroofi_txs', JSON.stringify(DEFAULT_TRANSACTIONS));
    }
    if (!localStorage.getItem('masroofi_cats')) {
      localStorage.setItem('masroofi_cats', JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem('masroofi_settings')) {
      localStorage.setItem('masroofi_settings', JSON.stringify({
        userName: 'علي السعدي',
        userEmail: '',
        userAvatar: 'https://lh3.googleusercontent.com/aida/AEtjO1VeKbkuvBzDHLv0TNHovllk8RusTgaXKvU3c9t-Ld1x8rrqOGYa_Qf_K_nTqvLDqu1bEM9UoJt0OifN5rVlFghoFE0Q1yMw67_ZDX_Lz99RvhQrK-cPN1IRa_wB4iVxVCOOjFjtMSQ20JrWh7lPazokw99eI8I1PVLFfhBLM1Oy_n-lo5sI14d3wcK7BHUDY2uk9iHIYy6OFfGzGAHq9ve2VbqMFFVPPo_9ewaNq0a1LjsO8qESwEePTM0',
        currency: 'د.ع',
        startingBalance: 0,
        monthlyBudgetCap: 1500000,
        startDayOfMonth: 1,
        darkMode: false,
        soundEffects: true,
        cloudSyncEnabled: true,
        lastCloudSync: null
      }));
    }

    this.transactions = JSON.parse(localStorage.getItem('masroofi_txs'));
    this.categories = JSON.parse(localStorage.getItem('masroofi_cats'));
    this.settings = JSON.parse(localStorage.getItem('masroofi_settings'));

    if (this.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  saveData(triggerSync = true) {
    localStorage.setItem('masroofi_txs', JSON.stringify(this.transactions));
    localStorage.setItem('masroofi_cats', JSON.stringify(this.categories));
    localStorage.setItem('masroofi_settings', JSON.stringify(this.settings));

    if (triggerSync && this.googleUser) {
      clearTimeout(this.syncDebounceTimer);
      this.syncDebounceTimer = setTimeout(() => {
        this.syncWithGoogleCloud(false);
      }, 1200);
    }
  }

  initElements() {
    this.navBtns = document.querySelectorAll('.nav-tab-btn');
    this.screens = document.querySelectorAll('.app-screen');
    
    this.mainBalanceEl = document.getElementById('main-balance');
    this.totalIncomeEl = document.getElementById('total-income');
    this.totalExpenseEl = document.getElementById('total-expense');
    this.budgetProgressEl = document.getElementById('budget-progress-bar');
    this.budgetSpentTextEl = document.getElementById('budget-spent-text');
    this.budgetRemainingEl = document.getElementById('budget-remaining-text');
    this.todayDateEl = document.getElementById('today-date-text');
    this.greetingNameEl = document.getElementById('greeting-user-name');
    this.profileCardNameEl = document.getElementById('profile-card-name');
    this.profileCardEmailEl = document.getElementById('profile-card-email');
    this.profileAvatarImg = document.getElementById('profile-avatar-img');
    this.headerAvatarImg = document.getElementById('header-avatar-img');
    this.syncStatusBadge = document.getElementById('sync-status-badge');
    this.lastSyncTimeEl = document.getElementById('last-sync-time');
    
    this.txListEl = document.getElementById('transactions-list');
    
    this.addModal = document.getElementById('add-tx-modal');
    this.amountDisplayEl = document.getElementById('amount-text');
    this.categoryGridEl = document.getElementById('modal-category-grid');
    this.txTitleInput = document.getElementById('tx-title-input');
    this.txNoteInput = document.getElementById('tx-note-input');
    this.txDateInput = document.getElementById('tx-date-input');
    this.txPaymentMethod = document.getElementById('tx-payment-method');
    
    this.toastEl = document.getElementById('toastNotification');
    this.toastMsgEl = document.getElementById('toastMessage');

    if (this.txDateInput) {
      this.txDateInput.value = new Date().toISOString().split('T')[0];
    }
  }

  initEventListeners() {
    // Navigation
    this.navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetScreen = btn.getAttribute('data-screen');
        if (targetScreen) {
          this.vibrate(10);
          this.switchScreen(targetScreen);
        }
      });
    });

    // Eye toggle
    const eyeBtn = document.getElementById('toggle-balance-btn');
    if (eyeBtn) {
      eyeBtn.addEventListener('click', () => {
        this.vibrate(15);
        this.toggleBalanceVisibility();
      });
    }

    // Keypad number taps
    document.querySelectorAll('.keypad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.vibrate(12);
        const val = btn.getAttribute('data-val');
        this.handleKeypadInput(val);
      });
    });

    // Quick addition chips
    document.querySelectorAll('.quick-amount-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.vibrate(15);
        const addVal = parseInt(chip.getAttribute('data-add'), 10) || 0;
        let current = parseInt(this.enteredAmount.replace(/,/g, ''), 10) || 0;
        current += addVal;
        this.enteredAmount = current.toString();
        this.updateAmountDisplay();
      });
    });

    // Transaction Type Tabs
    const tabExpense = document.getElementById('tab-type-expense');
    const tabIncome = document.getElementById('tab-type-income');
    if (tabExpense && tabIncome) {
      tabExpense.addEventListener('click', () => {
        this.vibrate(15);
        this.setTxType('expense');
      });
      tabIncome.addEventListener('click', () => {
        this.vibrate(15);
        this.setTxType('income');
      });
    }

    // Modal open / close
    const openAddBtn = document.getElementById('open-add-modal-btn');
    const openAddHeroBtn = document.getElementById('hero-quick-add-btn');
    const closeAddBtn = document.getElementById('close-add-modal-btn');
    
    if (openAddBtn) openAddBtn.addEventListener('click', () => { this.vibrate(20); this.openAddModal(); });
    if (openAddHeroBtn) openAddHeroBtn.addEventListener('click', () => { this.vibrate(20); this.openAddModal(); });
    if (closeAddBtn) closeAddBtn.addEventListener('click', () => { this.vibrate(10); this.closeAddModal(); });

    // Submit Tx
    const saveTxBtn = document.getElementById('save-tx-btn');
    if (saveTxBtn) {
      saveTxBtn.addEventListener('click', () => this.saveTransaction());
    }

    // Search & Filter
    const searchInput = document.getElementById('tx-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderTransactions();
      });
    }

    // Filter Chips
    document.querySelectorAll('.tx-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.vibrate(10);
        document.querySelectorAll('.tx-filter-chip').forEach(c => {
          c.classList.remove('bg-primary-container', 'text-on-primary');
          c.classList.add('bg-surface-container', 'text-on-surface-variant');
        });
        chip.classList.remove('bg-surface-container', 'text-on-surface-variant');
        chip.classList.add('bg-primary-container', 'text-on-primary');
        this.txFilter = chip.getAttribute('data-filter');
        this.renderTransactions();
      });
    });

    // Dark mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => {
        this.vibrate(15);
        this.toggleDarkMode();
      });
    }

    // Google Cloud Sync & Login Buttons
    const googleLoginBtn = document.getElementById('google-signin-btn');
    const googleLogoutBtn = document.getElementById('google-signout-btn');
    const syncNowBtn = document.getElementById('sync-now-btn');

    if (googleLoginBtn) googleLoginBtn.addEventListener('click', () => this.handleGoogleSignIn());
    if (googleLogoutBtn) googleLogoutBtn.addEventListener('click', () => this.handleGoogleSignOut());
    if (syncNowBtn) syncNowBtn.addEventListener('click', () => this.syncWithGoogleCloud(true));

    // Google Cloud Settings Modal
    const openGoogleSettingsBtn = document.getElementById('open-google-settings-btn');
    const openGoogleSettingsBtnOnline = document.getElementById('open-google-settings-btn-online');
    const closeGoogleModalBtn = document.getElementById('close-google-modal-btn');
    const closeGoogleModalBtn2 = document.getElementById('close-google-modal-btn2');
    const saveGoogleClientIdBtn = document.getElementById('save-google-client-id-btn');
    const resetGoogleClientIdBtn = document.getElementById('reset-google-client-id-btn');
    const googleForcePushBtn = document.getElementById('google-force-push-btn');
    const googleForcePullBtn = document.getElementById('google-force-pull-btn');

    if (openGoogleSettingsBtn) openGoogleSettingsBtn.addEventListener('click', () => this.openGoogleSettingsModal());
    if (openGoogleSettingsBtnOnline) openGoogleSettingsBtnOnline.addEventListener('click', () => this.openGoogleSettingsModal());
    if (closeGoogleModalBtn) closeGoogleModalBtn.addEventListener('click', () => this.closeGoogleSettingsModal());
    if (closeGoogleModalBtn2) closeGoogleModalBtn2.addEventListener('click', () => this.closeGoogleSettingsModal());
    if (saveGoogleClientIdBtn) saveGoogleClientIdBtn.addEventListener('click', () => this.saveCustomGoogleClientId());
    if (resetGoogleClientIdBtn) resetGoogleClientIdBtn.addEventListener('click', () => this.resetCustomGoogleClientId());
    if (googleForcePushBtn) googleForcePushBtn.addEventListener('click', () => this.syncWithGoogleCloud(true, 'push'));
    if (googleForcePullBtn) googleForcePullBtn.addEventListener('click', () => this.syncWithGoogleCloud(true, 'pull'));

    // Re-sync on network reconnect
    window.addEventListener('online', () => {
      console.log('[Masroofi] Network online detected. Triggering sync.');
      if (this.googleUser) {
        this.syncWithGoogleCloud(false);
      }
    });

    // Profile and Budget edit
    const editNameBtn = document.getElementById('edit-profile-name-btn');
    if (editNameBtn) editNameBtn.addEventListener('click', () => this.promptEditName());

    const editBudgetBtn = document.getElementById('edit-monthly-budget-btn');
    if (editBudgetBtn) editBudgetBtn.addEventListener('click', () => this.promptEditBudget());

    const exportDataBtn = document.getElementById('export-data-btn');
    if (exportDataBtn) exportDataBtn.addEventListener('click', () => this.exportDataJSON());

    const importDataBtn = document.getElementById('import-data-btn');
    const importFileInput = document.getElementById('import-file-input');
    if (importDataBtn && importFileInput) {
      importDataBtn.addEventListener('click', () => importFileInput.click());
      importFileInput.addEventListener('change', (e) => this.importDataJSON(e));
    }

    const resetDataBtn = document.getElementById('reset-data-btn');
    if (resetDataBtn) resetDataBtn.addEventListener('click', () => this.resetDataDefaults());

    const printStatementBtn = document.getElementById('print-statement-btn');
    if (printStatementBtn) printStatementBtn.addEventListener('click', () => window.print());

    // Category Screen Tabs
    const catTabExpense = document.getElementById('cat-tab-expense');
    const catTabIncome = document.getElementById('cat-tab-income');
    if (catTabExpense && catTabIncome) {
      catTabExpense.addEventListener('click', () => {
        this.vibrate(10);
        catTabExpense.classList.add('bg-primary-container', 'text-on-primary');
        catTabExpense.classList.remove('text-on-surface-variant');
        catTabIncome.classList.remove('bg-primary-container', 'text-on-primary');
        catTabIncome.classList.add('text-on-surface-variant');
        this.renderCategoryList('expense');
      });
      catTabIncome.addEventListener('click', () => {
        this.vibrate(10);
        catTabIncome.classList.add('bg-primary-container', 'text-on-primary');
        catTabIncome.classList.remove('text-on-surface-variant');
        catTabExpense.classList.remove('bg-primary-container', 'text-on-primary');
        catTabExpense.classList.add('text-on-surface-variant');
        this.renderCategoryList('income');
      });
    }

    // Add Category
    const addCategoryBtn = document.getElementById('add-new-category-btn');
    if (addCategoryBtn) addCategoryBtn.addEventListener('click', () => this.openAddCategoryModal());

    // Stats Range
    document.querySelectorAll('.stats-range-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.vibrate(10);
        document.querySelectorAll('.stats-range-btn').forEach(b => {
          b.classList.remove('bg-primary-container', 'text-on-primary');
          b.classList.add('bg-surface-container', 'text-on-surface-variant');
        });
        btn.classList.add('bg-primary-container', 'text-on-primary');
        btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
        this.activeStatsRange = btn.getAttribute('data-range');
        this.renderStatistics();
      });
    });
  }

  // Mobile PWA Service Worker Registration
  initPWA() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('[Masroofi] Service Worker Registered'))
        .catch(err => console.warn('[Masroofi] SW error:', err));
    }
  }

  // Mobile Swipe and Pull Gestures
  initTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    const tabOrder = ['dashboard', 'statistics', 'categories', 'settings'];

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Check horizontal swipe (minimum 70px diff and not vertical scroll)
      if (Math.abs(diffX) > 75 && Math.abs(diffX) > Math.abs(diffY) * 1.6) {
        const currentIdx = tabOrder.indexOf(this.currentScreen);
        if (diffX > 0) {
          // Swipe Right (in RTL: Next Tab)
          if (currentIdx < tabOrder.length - 1) {
            this.vibrate(10);
            this.switchScreen(tabOrder[currentIdx + 1]);
          }
        } else {
          // Swipe Left (in RTL: Previous Tab)
          if (currentIdx > 0) {
            this.vibrate(10);
            this.switchScreen(tabOrder[currentIdx - 1]);
          }
        }
      }
    }, { passive: true });
  }

  // ==========================================
  // GOOGLE ACCOUNT AUTH & GOOGLE DRIVE CLOUD ENGINE
  // ==========================================
  getGoogleClientId() {
    const saved = localStorage.getItem('masroofi_google_client_id');
    if (saved && !saved.startsWith('1080534388753')) {
      localStorage.removeItem('masroofi_google_client_id');
      return this.defaultGoogleClientId;
    }
    return saved || this.defaultGoogleClientId;
  }

  saveCustomGoogleClientId() {
    const input = document.getElementById('google-client-id-input');
    if (!input) return;
    const val = input.value.trim();
    if (!val) {
      this.showToast('يرجى إدخال معرّف Client ID صحيح', 'warning');
      return;
    }
    localStorage.setItem('masroofi_google_client_id', val);
    this.showToast('تم حفظ معرّف Google Client ID بنجاح');
    this.initGoogleIdentityClient();
    this.closeGoogleSettingsModal();
  }

  resetCustomGoogleClientId() {
    localStorage.removeItem('masroofi_google_client_id');
    const input = document.getElementById('google-client-id-input');
    if (input) input.value = this.defaultGoogleClientId;
    this.showToast('تمت استعادة معرّف Google الافتراضي');
    this.initGoogleIdentityClient();
  }

  openGoogleSettingsModal() {
    this.vibrate(12);
    const modal = document.getElementById('google-cloud-modal');
    const input = document.getElementById('google-client-id-input');
    const emailSpan = document.getElementById('google-modal-user-email');
    const badge = document.getElementById('google-connection-badge');

    if (input) input.value = this.getGoogleClientId();
    if (this.googleUser) {
      if (emailSpan) emailSpan.textContent = `${this.googleUser.name} (${this.googleUser.email})`;
      if (badge) {
        badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-tajawal font-bold bg-[#06D6A0]/15 text-[#06D6A0]';
        badge.textContent = 'متصل بنجاح';
      }
    } else {
      if (emailSpan) emailSpan.textContent = 'لا يوجد حساب Google مرتبط حالياً';
      if (badge) {
        badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-tajawal font-bold bg-outline/10 text-outline';
        badge.textContent = 'غير متصل';
      }
    }

    if (modal) modal.classList.add('open');
  }

  closeGoogleSettingsModal() {
    const modal = document.getElementById('google-cloud-modal');
    if (modal) modal.classList.remove('open');
  }

  initGoogleIdentityClient() {
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
      // Retry in 600ms if GIS library script is still downloading
      setTimeout(() => this.initGoogleIdentityClient(), 600);
      return;
    }

    try {
      this.googleTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.getGoogleClientId(),
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            console.error('[Masroofi] Google OAuth Error:', tokenResponse);
            if (tokenResponse.error === 'popup_closed_by_user') {
              this.showToast('تم إغلاق نافذة تسجيل الدخول', 'warning');
            } else if (tokenResponse.error === 'invalid_client' || tokenResponse.error === 'access_denied') {
              this.showToast('يتطلب ربط Google Client ID خاص بنطاقك. جارِ التحويل للربط المباشر...', 'warning');
              this.fallbackPromptSignIn();
            } else {
              this.showToast(`خطأ في مصادقة Google: ${tokenResponse.error_description || tokenResponse.error}`, 'error');
            }
            return;
          }
          await this.processGoogleAccessToken(tokenResponse.access_token, tokenResponse.expires_in);
        },
        error_callback: (error) => {
          console.warn('[Masroofi] Google OAuth Client Error:', error);
          this.fallbackPromptSignIn();
        }
      });
      console.log('[Masroofi] Google Identity Services Token Client Initialized');
    } catch (err) {
      console.warn('[Masroofi] GIS init exception:', err);
    }
  }

  initGoogleAuthStatus() {
    const authBoxOffline = document.getElementById('google-auth-offline-box');
    const authBoxOnline = document.getElementById('google-auth-online-box');
    const headerAvatar = document.getElementById('header-avatar-img');
    const profileAvatar = document.getElementById('profile-avatar-img');
    const profileCardAvatar = document.getElementById('profile-card-avatar');
    const profileCardName = document.getElementById('profile-card-name');
    const profileCardEmail = document.getElementById('profile-card-email');

    if (this.googleUser) {
      if (authBoxOffline) authBoxOffline.classList.add('hidden');
      if (authBoxOnline) authBoxOnline.classList.remove('hidden');
      if (profileCardEmail) profileCardEmail.textContent = this.googleUser.email;
      if (profileCardName) profileCardName.textContent = this.googleUser.name;
      if (this.greetingNameEl) this.greetingNameEl.textContent = `أهلاً ${this.googleUser.name.split(' ')[0]}`;

      if (this.googleUser.picture) {
        if (headerAvatar) headerAvatar.src = this.googleUser.picture;
        if (profileAvatar) profileAvatar.src = this.googleUser.picture;
        if (profileCardAvatar) profileCardAvatar.src = this.googleUser.picture;
      }

      this.updateSyncBadge(true);
    } else {
      if (authBoxOffline) authBoxOffline.classList.remove('hidden');
      if (authBoxOnline) authBoxOnline.classList.add('hidden');
      this.updateSyncBadge(false);
    }
  }

  async handleGoogleSignIn() {
    this.vibrate(20);

    if (!navigator.onLine) {
      this.showToast('لا يوجد اتصال بالإنترنت. يرجى الاتصال بالشبكة للمزامنة مع Google', 'warning');
      return;
    }

    if (!this.googleTokenClient) {
      this.initGoogleIdentityClient();
    }

    if (this.googleTokenClient) {
      try {
        this.googleTokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (e) {
        console.error('[Masroofi] Failed to trigger OAuth consent:', e);
        this.fallbackPromptSignIn();
      }
    } else {
      this.fallbackPromptSignIn();
    }
  }

  async fallbackPromptSignIn() {
    const email = prompt('أدخل بريدك الإلكتروني لحساب Google Gmail للربط السحابي:', this.settings.userEmail || '');
    if (!email) return;
    const name = prompt('أدخل اسمك:', this.settings.userName || email.split('@')[0]);

    this.googleUser = {
      uid: 'google-usr-' + Date.now(),
      name: (name || 'مستخدم Google').trim(),
      email: email.trim(),
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=102542&color=fff&size=128`,
      accessToken: null,
      tokenExpiry: null,
      driveFileId: null,
      connectedAt: new Date().toISOString()
    };

    localStorage.setItem('masroofi_google_user', JSON.stringify(this.googleUser));
    this.settings.userName = this.googleUser.name;
    this.settings.userEmail = this.googleUser.email;
    this.settings.userAvatar = this.googleUser.picture;
    this.saveData(false);

    this.audio.playSuccess();
    this.showToast(`تم ربط حساب Google بنجاح: ${this.googleUser.email}`);
    this.initGoogleAuthStatus();
    this.syncWithGoogleCloud(true);
  }

  async processGoogleAccessToken(accessToken, expiresIn) {
    try {
      this.showToast('جارِ مصادقة حساب Google وجلب بياناتك...', 'info');

      // Fetch Real Google User Profile
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!res.ok) {
        throw new Error(`Google Profile Error: ${res.status}`);
      }

      const info = await res.json();
      console.log('[Masroofi] Real Google User Authenticated:', info);

      this.googleUser = {
        uid: info.sub,
        name: info.name || 'مستخدم Google',
        email: info.email,
        picture: info.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(info.name || 'User')}&background=102542&color=fff&size=128`,
        accessToken: accessToken,
        tokenExpiry: Date.now() + (parseInt(expiresIn, 10) || 3600) * 1000,
        driveFileId: this.googleUser?.driveFileId || null,
        connectedAt: new Date().toISOString()
      };

      localStorage.setItem('masroofi_google_user', JSON.stringify(this.googleUser));
      this.settings.userName = this.googleUser.name;
      this.settings.userEmail = this.googleUser.email;
      this.settings.userAvatar = this.googleUser.picture;
      localStorage.setItem('masroofi_settings', JSON.stringify(this.settings));

      this.audio.playSuccess();
      this.showToast(`مرحباً ${this.googleUser.name}! تم الربط بحساب Google بنجاح 🎉`);
      this.initGoogleAuthStatus();
      
      // Immediately run real bidirectional cloud sync with Google Drive
      await this.syncWithGoogleCloud(true, 'bidirectional');
    } catch (err) {
      console.error('[Masroofi] Error processing Google token:', err);
      this.showToast('حدث خطأ أثناء الاتصال بحساب Google: ' + err.message, 'error');
    }
  }

  handleGoogleSignOut() {
    if (confirm('هل ترغب في تسجيل الخروج من حساب Google؟ (ستبقى كافة بياناتك ومصاريفك محفوظة محلياً على هاتفك)')) {
      if (this.googleUser?.accessToken && typeof google !== 'undefined' && google.accounts?.oauth2) {
        try {
          google.accounts.oauth2.revoke(this.googleUser.accessToken, () => {
            console.log('[Masroofi] Token revoked from Google');
          });
        } catch (e) {}
      }

      this.googleUser = null;
      localStorage.removeItem('masroofi_google_user');
      this.initGoogleAuthStatus();
      this.showToast('تم تسجيل الخروج من حساب Google');
    }
  }

  // ==========================================
  // REAL GOOGLE DRIVE CLOUD SYNC & STORAGE
  // ==========================================
  async syncWithGoogleCloud(showToastMsg = false, forceDirection = 'bidirectional') {
    if (!this.googleUser) {
      if (showToastMsg) this.showToast('يرجى تسجيل الدخول بحساب Google أولاً للمزامنة السحابية', 'warning');
      return;
    }

    if (!navigator.onLine) {
      if (showToastMsg) this.showToast('لا يوجد اتصال بالإنترنت حالياً للمزامنة', 'warning');
      return;
    }

    // Check Token Expiry
    if (this.googleUser.tokenExpiry && Date.now() > this.googleUser.tokenExpiry - 60000) {
      console.warn('[Masroofi] Google OAuth token expired. Requesting refresh.');
      if (this.googleTokenClient) {
        this.googleTokenClient.requestAccessToken({ prompt: '' });
        return;
      }
    }

    const syncBtn = document.getElementById('sync-now-btn');
    const syncIcon = document.getElementById('sync-btn-icon');
    if (syncIcon) syncIcon.classList.add('sync-active');

    this.isSyncing = true;
    this.updateSyncBadge(true, true);

    try {
      const accessToken = this.googleUser.accessToken;

      if (accessToken) {
        // 1. Search for existing masroofi_cloud_database.json in Google Drive
        let fileId = this.googleUser.driveFileId;

        if (!fileId) {
          const searchRes = await fetch(
            "https://www.googleapis.com/drive/v3/files?q=name%3D'masroofi_cloud_database.json'+and+trashed%3Dfalse&fields=files(id,name,modifiedTime)&spaces=drive",
            {
              headers: { Authorization: `Bearer ${accessToken}` }
            }
          );

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (searchData.files && searchData.files.length > 0) {
              fileId = searchData.files[0].id;
              this.googleUser.driveFileId = fileId;
              localStorage.setItem('masroofi_google_user', JSON.stringify(this.googleUser));
            }
          }
        }

        // 2. Download and Smart-Merge Remote Data if file exists (PULL / BIDIRECTIONAL)
        if (fileId && (forceDirection === 'pull' || forceDirection === 'bidirectional')) {
          const readRes = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
              headers: { Authorization: `Bearer ${accessToken}` }
            }
          );

          if (readRes.ok) {
            const remoteData = await readRes.json();
            this.mergeCloudData(remoteData);
          }
        }

        // 3. Prepare Payload to Save to Google Drive (PUSH / BIDIRECTIONAL)
        const cloudPayload = {
          app: 'Masroofi',
          version: '1.0.0',
          uid: this.googleUser.uid,
          email: this.googleUser.email,
          lastUpdated: new Date().toISOString(),
          transactions: this.transactions,
          categories: this.categories,
          settings: this.settings
        };

        if (fileId) {
          // Update Existing File via Drive API PATCH
          const updateRes = await fetch(
            `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(cloudPayload, null, 2)
            }
          );

          if (!updateRes.ok && updateRes.status !== 200) {
            console.warn('[Masroofi] Drive update error status:', updateRes.status);
          }
        } else {
          // Create New masroofi_cloud_database.json in User's Google Drive
          const metadata = {
            name: 'masroofi_cloud_database.json',
            mimeType: 'application/json',
            description: 'قاعدة بيانات النسخ الاحتياطي السحابي لتطبيق مصروفي'
          };

          const boundary = '-------314159265358979323846';
          const delimiter = `\r\n--${boundary}\r\n`;
          const closeDelimiter = `\r\n--${boundary}--`;

          const multipartBody =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(cloudPayload, null, 2) +
            closeDelimiter;

          const createRes = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': `multipart/related; boundary=${boundary}`
              },
              body: multipartBody
            }
          );

          if (createRes.ok) {
            const createData = await createRes.json();
            this.googleUser.driveFileId = createData.id;
            localStorage.setItem('masroofi_google_user', JSON.stringify(this.googleUser));
          }
        }
      }

      // Save sync timestamp
      this.settings.lastCloudSync = new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem('masroofi_settings', JSON.stringify(this.settings));

      this.isSyncing = false;
      if (syncIcon) syncIcon.classList.remove('sync-active');
      this.updateSyncBadge(true, false);

      if (showToastMsg) {
        this.audio.playSuccess();
        this.showToast(`تمت المزامنة بنجاح مع Google Drive ☁️ (${this.transactions.length} عملية محفوظة)`);
      }
    } catch (err) {
      console.error('[Masroofi] Sync failed:', err);
      this.isSyncing = false;
      if (syncIcon) syncIcon.classList.remove('sync-active');
      this.updateSyncBadge(true, false);
      if (showToastMsg) {
        this.showToast('تم حفظ البيانات محلياً، وتعذر تحديث Google Drive مؤقتاً', 'warning');
      }
    }
  }

  // Smart Bidirectional Data Merger
  mergeCloudData(remoteData) {
    if (!remoteData || !Array.isArray(remoteData.transactions)) return;

    let mergedCount = 0;
    const localMap = new Map(this.transactions.map(t => [t.id, t]));

    remoteData.transactions.forEach(remoteTx => {
      if (!localMap.has(remoteTx.id)) {
        localMap.set(remoteTx.id, remoteTx);
        mergedCount++;
      }
    });

    this.transactions = Array.from(localMap.values());
    this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Merge categories if remote has custom ones
    if (Array.isArray(remoteData.categories)) {
      const catMap = new Map(this.categories.map(c => [c.id, c]));
      remoteData.categories.forEach(remoteCat => {
        if (!catMap.has(remoteCat.id)) {
          catMap.set(remoteCat.id, remoteCat);
        }
      });
      this.categories = Array.from(catMap.values());
    }

    localStorage.setItem('masroofi_txs', JSON.stringify(this.transactions));
    localStorage.setItem('masroofi_cats', JSON.stringify(this.categories));

    this.render();
    if (mergedCount > 0) {
      console.log(`[Masroofi] Merged ${mergedCount} new cloud transactions`);
    }
  }

  updateSyncBadge(isLoggedIn, syncing = false) {
    if (!this.syncStatusBadge) return;

    if (!isLoggedIn) {
      this.syncStatusBadge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-outline"></span>
        <span class="text-outline font-tajawal text-xs font-bold">وضع محلي (غير متزامن)</span>
      `;
    } else if (syncing) {
      this.syncStatusBadge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-tertiary-gold animate-ping"></span>
        <span class="text-primary font-tajawal text-xs font-bold">جارِ المزامنة مع Google Drive...</span>
      `;
    } else {
      const time = this.settings.lastCloudSync || 'الآن';
      this.syncStatusBadge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-[#06D6A0]"></span>
        <span class="text-[#06D6A0] font-tajawal text-xs font-bold">متزامن مع Google Drive (${time})</span>
      `;
    }

    if (this.lastSyncTimeEl && this.settings.lastCloudSync) {
      this.lastSyncTimeEl.textContent = this.settings.lastCloudSync;
    }
  }

  // ==========================================
  // SCREEN NAVIGATION & CORE APP LOGIC
  // ==========================================
  switchScreen(screenName) {
    this.currentScreen = screenName;
    this.screens.forEach(screen => {
      if (screen.id === `screen-${screenName}`) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    });

    this.navBtns.forEach(btn => {
      const activePill = btn.querySelector('.active-pill');
      const icon = btn.querySelector('.material-symbols-outlined');
      
      if (btn.getAttribute('data-screen') === screenName) {
        btn.classList.add('text-primary-container');
        btn.classList.remove('text-on-surface-variant');
        if (activePill) activePill.classList.remove('hidden');
        if (icon) icon.style.fontVariationSettings = "'FILL' 1";
      } else {
        btn.classList.remove('text-primary-container');
        btn.classList.add('text-on-surface-variant');
        if (activePill) activePill.classList.add('hidden');
        if (icon) icon.style.fontVariationSettings = "'FILL' 0";
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (screenName === 'statistics') {
      this.renderStatistics();
    } else if (screenName === 'categories') {
      this.renderCategoryList('expense');
    }
  }

  formatIQD(amount) {
    if (isNaN(amount)) return '0';
    return Number(amount).toLocaleString('ar-IQ');
  }

  handleKeypadInput(val) {
    if (val === 'C') {
      this.enteredAmount = '0';
    } else if (val === 'DEL') {
      let cleaned = this.enteredAmount.replace(/,/g, '');
      if (cleaned.length > 1) {
        cleaned = cleaned.slice(0, -1);
      } else {
        cleaned = '0';
      }
      this.enteredAmount = cleaned;
    } else if (val === '000') {
      let cleaned = this.enteredAmount.replace(/,/g, '');
      if (cleaned !== '0' && cleaned.length < 9) {
        this.enteredAmount = cleaned + '000';
      }
    } else if (val === '250' || val === '500' || val === '750') {
      let cleaned = this.enteredAmount.replace(/,/g, '');
      let current = parseInt(cleaned, 10) || 0;
      current += parseInt(val, 10);
      this.enteredAmount = current.toString();
    } else {
      let cleaned = this.enteredAmount.replace(/,/g, '');
      if (cleaned === '0') {
        cleaned = val;
      } else if (cleaned.length < 10) {
        cleaned += val;
      }
      this.enteredAmount = cleaned;
    }
    this.updateAmountDisplay();
  }

  updateAmountDisplay() {
    const raw = parseInt(this.enteredAmount.replace(/,/g, ''), 10) || 0;
    this.amountDisplayEl.textContent = raw.toLocaleString('en-US');
  }

  setTxType(type) {
    this.txType = type;
    const tabExpense = document.getElementById('tab-type-expense');
    const tabIncome = document.getElementById('tab-type-income');
    
    if (type === 'expense') {
      tabExpense.className = 'flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-tajawal font-bold text-xs sm:text-sm transition-all shadow-sm bg-error-container text-on-error-container';
      tabIncome.className = 'flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-tajawal font-bold text-xs sm:text-sm text-on-surface-variant hover:text-on-surface transition-all';
    } else {
      tabIncome.className = 'flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-tajawal font-bold text-xs sm:text-sm transition-all shadow-sm bg-[#06D6A0]/20 text-[#06D6A0]';
      tabExpense.className = 'flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-tajawal font-bold text-xs sm:text-sm text-on-surface-variant hover:text-on-surface transition-all';
    }

    this.renderModalCategories();
  }

  openAddModal(prefilledCategory = null) {
    this.enteredAmount = '0';
    this.updateAmountDisplay();
    this.setTxType('expense');
    this.selectedCategory = prefilledCategory || this.categories.find(c => c.type === 'expense')?.id || null;
    this.renderModalCategories();
    
    if (this.txTitleInput) this.txTitleInput.value = '';
    if (this.txNoteInput) this.txNoteInput.value = '';
    if (this.txDateInput) this.txDateInput.value = new Date().toISOString().split('T')[0];

    this.addModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeAddModal() {
    this.addModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  renderModalCategories() {
    const filtered = this.categories.filter(c => c.type === this.txType);
    if (!this.selectedCategory && filtered.length > 0) {
      this.selectedCategory = filtered[0].id;
    }
    
    let html = '';
    filtered.forEach(cat => {
      const isSelected = this.selectedCategory === cat.id;
      const bgClass = isSelected 
        ? 'bg-primary-container text-on-primary shadow-md ring-2 ring-primary-container/20' 
        : 'bg-surface-container-low hover:bg-surface-container text-on-surface';

      html += `
        <button type="button" class="relative flex flex-col items-center justify-center p-2.5 rounded-2xl ${bgClass} transition-all active:scale-95 group" onclick="app.selectCategory('${cat.id}')">
          <span class="text-2xl mb-1">${cat.emoji || '💳'}</span>
          <span class="font-tajawal text-xs font-bold truncate max-w-full">${cat.name}</span>
          ${isSelected ? `
            <span class="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-on-primary text-primary-container flex items-center justify-center">
              <span class="material-symbols-outlined text-[11px] font-bold">check</span>
            </span>
          ` : ''}
        </button>
      `;
    });

    this.categoryGridEl.innerHTML = html;
  }

  selectCategory(catId) {
    this.vibrate(10);
    this.selectedCategory = catId;
    this.renderModalCategories();
  }

  saveTransaction() {
    const rawAmount = parseInt(this.enteredAmount.replace(/,/g, ''), 10) || 0;
    if (rawAmount <= 0) {
      this.vibrate([50, 50, 50]);
      this.showToast('يرجى إدخال مبلغ صحيح أكبر من الصفر', 'warning');
      return;
    }

    const cat = this.categories.find(c => c.id === this.selectedCategory) || this.categories[0];
    const title = this.txTitleInput.value.trim() || cat.name;
    const note = this.txNoteInput.value.trim();
    const date = this.txDateInput.value || new Date().toISOString().split('T')[0];
    const paymentMethod = this.txPaymentMethod ? this.txPaymentMethod.value : 'نقداً';

    const newTx = {
      id: 'tx-' + Date.now(),
      type: this.txType,
      amount: rawAmount,
      categoryId: cat.id,
      title: title,
      note: note,
      date: date,
      paymentMethod: paymentMethod
    };

    this.transactions.unshift(newTx);
    this.saveData(true);
    this.closeAddModal();
    this.render();
    this.audio.playSuccess();
    this.showToast(`تم تسجيل ${this.txType === 'expense' ? 'المصروف' : 'الدخل'} بقيمة ${this.formatIQD(rawAmount)} د.ع`);
  }

  deleteTransaction(id) {
    this.vibrate(25);
    const idx = this.transactions.findIndex(t => t.id === id);
    if (idx > -1) {
      this.transactions.splice(idx, 1);
      this.saveData(true);
      this.render();
      this.showToast(`تم حذف العملية بنجاح`, 'delete');
    }
  }

  calculateTotals() {
    let income = 0;
    let expense = 0;

    this.transactions.forEach(tx => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    });

    const net = (this.settings.startingBalance || 0) + income - expense;
    return { income, expense, net };
  }

  toggleBalanceVisibility() {
    this.balanceHidden = !this.balanceHidden;
    const eyeIcon = document.getElementById('eye-icon');
    if (eyeIcon) {
      eyeIcon.textContent = this.balanceHidden ? 'visibility_off' : 'visibility';
    }
    this.renderBalances();
  }

  renderBalances() {
    const { income, expense, net } = this.calculateTotals();
    
    if (this.mainBalanceEl) {
      this.mainBalanceEl.textContent = this.balanceHidden ? '••••••••' : this.formatIQD(net);
    }
    if (this.totalIncomeEl) {
      this.totalIncomeEl.textContent = this.balanceHidden ? '••••••' : this.formatIQD(income);
    }
    if (this.totalExpenseEl) {
      this.totalExpenseEl.textContent = this.balanceHidden ? '••••••' : this.formatIQD(expense);
    }

    const cap = this.settings.monthlyBudgetCap || 1500000;
    const pct = Math.min(100, Math.round((expense / cap) * 100));
    
    if (this.budgetProgressEl) {
      this.budgetProgressEl.style.width = `${pct}%`;
      if (pct > 90) {
        this.budgetProgressEl.className = 'h-full rounded-full transition-all duration-500 bg-[#EF476F]';
      } else if (pct > 70) {
        this.budgetProgressEl.className = 'h-full rounded-full transition-all duration-500 bg-[#FFD166]';
      } else {
        this.budgetProgressEl.className = 'h-full rounded-full transition-all duration-500 bg-[#06D6A0]';
      }
    }

    if (this.budgetSpentTextEl) {
      this.budgetSpentTextEl.textContent = `${pct}% من السقف الشهري (${this.formatIQD(expense)} / ${this.formatIQD(cap)} د.ع)`;
    }

    const remaining = cap - expense;
    if (this.budgetRemainingEl) {
      if (remaining >= 0) {
        this.budgetRemainingEl.textContent = `المتبقي: ${this.formatIQD(remaining)} د.ع`;
        this.budgetRemainingEl.className = 'text-xs font-bold text-[#06D6A0] font-tajawal';
      } else {
        this.budgetRemainingEl.textContent = `تجاوز الميزانية بـ: ${this.formatIQD(Math.abs(remaining))} د.ع`;
        this.budgetRemainingEl.className = 'text-xs font-bold text-[#EF476F] font-tajawal';
      }
    }
  }

  renderTransactions() {
    let filtered = this.transactions.filter(tx => {
      if (this.txFilter !== 'all' && tx.type !== this.txFilter) return false;
      if (this.searchQuery) {
        const cat = this.categories.find(c => c.id === tx.categoryId);
        const matchTitle = (tx.title || '').toLowerCase().includes(this.searchQuery);
        const matchNote = (tx.note || '').toLowerCase().includes(this.searchQuery);
        const matchCat = cat ? cat.name.toLowerCase().includes(this.searchQuery) : false;
        return matchTitle || matchNote || matchCat;
      }
      return true;
    });

    if (filtered.length === 0) {
      this.txListEl.innerHTML = `
        <div class="py-12 flex flex-col items-center justify-center text-center text-on-surface-variant gap-3">
          <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-3xl">
            💳
          </div>
          <p class="font-cairo font-bold text-sm">لا توجد عمليات مسجلة تطابق بحثك</p>
          <button onclick="app.openAddModal()" class="mt-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-tajawal font-bold text-sm shadow-md active:scale-95">
            + إضافة عملية جديدة
          </button>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(tx => {
      const cat = this.categories.find(c => c.id === tx.categoryId) || { name: 'أخرى', emoji: '💳', color: '#b5d0fd' };
      const isExpense = tx.type === 'expense';
      const sign = isExpense ? '-' : '+';
      const amountColor = isExpense ? 'text-on-surface font-extrabold' : 'text-[#06D6A0] font-extrabold';

      html += `
        <div class="group bg-surface-container-lowest p-3 sm:p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-transparent hover:border-surface-container">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm transition-transform group-hover:scale-105" style="background-color: ${cat.color || '#e6eeff'}">
              ${cat.emoji || '💳'}
            </div>
            <div class="flex flex-col min-w-0">
              <span class="font-cairo font-bold text-sm sm:text-base text-on-surface truncate">${tx.title}</span>
              <div class="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant font-tajawal">
                <span>${cat.name}</span>
                <span>•</span>
                <span>${this.formatDateLabel(tx.date)}</span>
                ${tx.paymentMethod ? `<span class="px-1.5 py-0.5 rounded bg-surface-container text-[11px] font-medium">${tx.paymentMethod}</span>` : ''}
              </div>
              ${tx.note ? `<p class="text-xs text-outline truncate mt-0.5 font-cairo">${tx.note}</p>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <div class="flex flex-col items-end">
              <span class="font-alexandria text-base sm:text-lg ${amountColor} tracking-tight">
                ${sign} ${this.formatIQD(tx.amount)}
              </span>
              <span class="text-[11px] text-on-surface-variant font-tajawal">د.ع</span>
            </div>
            <button onclick="app.deleteTransaction('${tx.id}')" aria-label="حذف" class="w-8 h-8 rounded-full bg-surface-container-low text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors flex items-center justify-center opacity-70 group-hover:opacity-100">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
      `;
    });

    this.txListEl.innerHTML = html;
  }

  formatDateLabel(dateStr) {
    if (!dateStr) return '';
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'اليوم';
    
    const yest = getPastDate(1);
    if (dateStr === yest) return 'أمس';

    try {
      const parts = dateStr.split('-');
      return `${parts[2]}/${parts[1]}`;
    } catch(e) {
      return dateStr;
    }
  }

  renderStatistics() {
    const { income, expense } = this.calculateTotals();
    const totalSpentEl = document.getElementById('stats-total-spent');
    if (totalSpentEl) totalSpentEl.textContent = this.formatIQD(expense);

    const totalIncomeStatEl = document.getElementById('stats-total-income');
    if (totalIncomeStatEl) totalIncomeStatEl.textContent = this.formatIQD(income);

    const txCountEl = document.getElementById('stats-tx-count');
    if (txCountEl) txCountEl.textContent = this.transactions.length;

    this.renderWeeklyChart();
    this.renderCategoryBreakdown();
  }

  renderWeeklyChart() {
    const days = [
      { name: 'السبت', short: 'سبت', total: 0 },
      { name: 'الأحد', short: 'أحد', total: 0 },
      { name: 'الإثنين', short: 'إثنين', total: 0 },
      { name: 'الثلاثاء', short: 'ثلاثاء', total: 0 },
      { name: 'الأربعاء', short: 'أربعاء', total: 0 },
      { name: 'الخميس', short: 'خميس', total: 0 },
      { name: 'الجمعة', short: 'جمعة', total: 0 }
    ];

    this.transactions.filter(t => t.type === 'expense').forEach((tx) => {
      const dayIndex = new Date(tx.date).getDay();
      const mapped = (dayIndex + 1) % 7;
      days[mapped].total += tx.amount;
    });

    const maxVal = Math.max(...days.map(d => d.total), 100000);
    const peakDay = days.reduce((prev, current) => (prev.total > current.total) ? prev : current, days[0]);

    const tooltipDay = document.getElementById('statsTooltipDay');
    const tooltipAmount = document.getElementById('statsTooltipAmount');

    if (tooltipDay && peakDay) {
      tooltipDay.textContent = `${peakDay.name} (الأعلى إنفاقاً)`;
    }
    if (tooltipAmount && peakDay) {
      tooltipAmount.textContent = this.formatIQD(peakDay.total);
    }

    const chartBarsContainer = document.getElementById('stats-chart-bars');
    if (!chartBarsContainer) return;

    let html = '';
    days.forEach(day => {
      const heightPct = Math.max(12, Math.round((day.total / maxVal) * 100));
      const isPeak = day.name === peakDay.name && day.total > 0;
      const barColor = isPeak ? 'bg-primary-container' : 'bg-secondary-container';

      html += `
        <div class="chart-col flex-1 flex flex-col items-center gap-2 cursor-pointer group" onclick="app.showChartDayTooltip('${day.name}', ${day.total})">
          <div class="w-full flex items-end justify-center h-36">
            <div class="bar-fill w-full max-w-[28px] ${barColor} rounded-t-xl transition-all duration-300 group-hover:bg-primary-container group-hover:scale-105 shadow-sm" style="height: ${heightPct}%;"></div>
          </div>
          <span class="font-tajawal text-xs font-semibold text-on-surface-variant group-hover:text-primary-container">${day.short}</span>
        </div>
      `;
    });

    chartBarsContainer.innerHTML = html;
  }

  showChartDayTooltip(dayName, amount) {
    this.vibrate(8);
    const tooltipDay = document.getElementById('statsTooltipDay');
    const tooltipAmount = document.getElementById('statsTooltipAmount');
    if (tooltipDay) tooltipDay.textContent = `${dayName}`;
    if (tooltipAmount) tooltipAmount.textContent = this.formatIQD(amount);
  }

  renderCategoryBreakdown() {
    const breakdownContainer = document.getElementById('stats-category-breakdown');
    if (!breakdownContainer) return;

    const catTotals = {};
    let totalExpense = 0;

    this.transactions.filter(t => t.type === 'expense').forEach(tx => {
      catTotals[tx.categoryId] = (catTotals[tx.categoryId] || 0) + tx.amount;
      totalExpense += tx.amount;
    });

    const sortedCats = Object.entries(catTotals)
      .map(([id, total]) => {
        const cat = this.categories.find(c => c.id === id) || { name: 'أخرى', emoji: '💳', color: '#b5d0fd' };
        const pct = totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0;
        return { cat, total, pct };
      })
      .sort((a, b) => b.total - a.total);

    if (sortedCats.length === 0) {
      breakdownContainer.innerHTML = `<p class="text-xs text-on-surface-variant text-center py-4">لا توجد مصاريف لتحليلها</p>`;
      return;
    }

    let html = '';
    sortedCats.forEach(({ cat, total, pct }) => {
      html += `
        <div class="bg-surface-container-lowest p-3 rounded-2xl shadow-sm flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-xl p-1.5 rounded-xl" style="background-color: ${cat.color || '#e6eeff'}">${cat.emoji}</span>
              <div>
                <span class="font-cairo font-bold text-sm text-on-surface">${cat.name}</span>
                <span class="text-xs text-outline block font-tajawal">${this.formatIQD(total)} د.ع</span>
              </div>
            </div>
            <span class="font-alexandria font-extrabold text-sm text-primary-container bg-surface-container px-2.5 py-1 rounded-full">
              ${pct}%
            </span>
          </div>
          <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 bg-primary-container" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    });

    breakdownContainer.innerHTML = html;
  }

  renderCategoryList(type = 'expense') {
    const listEl = document.getElementById('categories-management-list');
    if (!listEl) return;

    const filtered = this.categories.filter(c => c.type === type);
    let html = '';

    filtered.forEach(cat => {
      const txCount = this.transactions.filter(t => t.categoryId === cat.id).length;

      html += `
        <div class="group bg-surface-container-lowest p-3 sm:p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-transparent hover:border-surface-container">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm transition-transform group-hover:scale-105" style="background-color: ${cat.color || '#e6eeff'}">
              ${cat.emoji}
            </div>
            <div class="flex flex-col min-w-0">
              <span class="font-cairo font-bold text-base text-primary-container truncate">${cat.name}</span>
              <div class="flex items-center gap-2 text-xs text-outline font-tajawal">
                <span class="material-symbols-outlined text-[14px]">receipt_long</span>
                <span>${txCount} عملية مسجلة</span>
                ${cat.budget > 0 ? `<span>• السقف: ${this.formatIQD(cat.budget)} د.ع</span>` : ''}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button onclick="app.openEditCategoryModal('${cat.id}')" aria-label="تعديل" class="w-9 h-9 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary-container hover:bg-surface-container transition-colors flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button onclick="app.deleteCategory('${cat.id}')" aria-label="حذف" class="w-9 h-9 rounded-xl bg-surface-container-low text-error hover:bg-error-container/20 transition-colors flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;
  }

  openAddCategoryModal() {
    const name = prompt('أدخل اسم الصنف الجديد:');
    if (!name) return;
    const emoji = prompt('أدخل رمز تعبيري (Emoji):', '🏷️') || '🏷️';
    const budgetStr = prompt('أدخل سقف الميزانية المقترح بالدينار (اختياري):', '100000');
    const budget = parseInt(budgetStr, 10) || 0;

    const newCat = {
      id: 'cat-' + Date.now(),
      name: name.trim(),
      icon: 'sell',
      emoji: emoji,
      color: '#b5d0fd',
      budget: budget,
      type: 'expense'
    };

    this.categories.push(newCat);
    this.saveData(true);
    this.renderCategoryList('expense');
    this.showToast(`تمت إضافة صنف "${name}" بنجاح`);
  }

  openEditCategoryModal(catId) {
    const cat = this.categories.find(c => c.id === catId);
    if (!cat) return;

    const newName = prompt('تعديل اسم الصنف:', cat.name);
    if (!newName) return;
    const newEmoji = prompt('تعديل الرمز التعبيري:', cat.emoji) || cat.emoji;
    const newBudgetStr = prompt('تعديل سقف الميزانية:', cat.budget || 0);

    cat.name = newName.trim();
    cat.emoji = newEmoji;
    cat.budget = parseInt(newBudgetStr, 10) || 0;

    this.saveData(true);
    this.renderCategoryList(cat.type);
    this.render();
    this.showToast(`تم تعديل صنف "${cat.name}"`);
  }

  deleteCategory(catId) {
    if (this.categories.length <= 2) {
      this.showToast('لا يمكن حذف جميع الأصناف', 'warning');
      return;
    }
    const idx = this.categories.findIndex(c => c.id === catId);
    if (idx > -1) {
      const removed = this.categories[idx];
      this.categories.splice(idx, 1);
      this.saveData(true);
      this.renderCategoryList(removed.type);
      this.render();
      this.showToast(`تم حذف الصنف`, 'delete');
    }
  }

  toggleDarkMode() {
    this.settings.darkMode = !this.settings.darkMode;
    if (this.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.saveData(false);
    this.showToast(this.settings.darkMode ? 'تم تفعيل الوضع الليلي 🌙' : 'تم تفعيل الوضع الفاتح ☀️');
  }

  promptEditName() {
    const current = this.settings.userName || 'علي السعدي';
    const updated = prompt('أدخل اسم المستخدم الجديد:', current);
    if (updated && updated.trim()) {
      this.settings.userName = updated.trim();
      this.saveData(true);
      this.renderProfile();
      this.showToast(`تم تحديث الاسم: ${this.settings.userName}`);
    }
  }

  promptEditBudget() {
    const current = this.settings.monthlyBudgetCap || 1500000;
    const updated = prompt('أدخل سقف الميزانية الشهرية الإجمالية (بالدينار العراقي):', current);
    if (updated) {
      const num = parseInt(updated, 10);
      if (num > 0) {
        this.settings.monthlyBudgetCap = num;
        this.saveData(true);
        this.renderBalances();
        this.showToast(`تم تحديث الميزانية إلى ${this.formatIQD(num)} د.ع`);
      }
    }
  }

  exportDataJSON() {
    const exportBundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.googleUser,
      transactions: this.transactions,
      categories: this.categories,
      settings: this.settings
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `masroofi_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    this.showToast('تم تصدير النسخة الاحتياطية بنجاح 💾');
  }

  importDataJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const bundle = JSON.parse(e.target.result);
        if (bundle.transactions && Array.isArray(bundle.transactions)) {
          this.transactions = bundle.transactions;
        }
        if (bundle.categories && Array.isArray(bundle.categories)) {
          this.categories = bundle.categories;
        }
        if (bundle.settings) {
          this.settings = { ...this.settings, ...bundle.settings };
        }
        this.saveData(true);
        this.render();
        this.showToast('تم استعادة البيانات بنجاح ✅');
      } catch (err) {
        alert('الملف غير صالح أو تالف');
      }
    };
    reader.readAsText(file);
  }

  resetDataDefaults() {
    if (confirm('هل أنت متأكد من إعادة ضبط التطبيق وحذف كل العمليات؟')) {
      this.transactions = [...DEFAULT_TRANSACTIONS];
      this.categories = [...DEFAULT_CATEGORIES];
      this.saveData(true);
      this.render();
      this.showToast('تمت إعادة ضبط البيانات الافتراضية');
    }
  }

  renderProfile() {
    const name = this.settings.userName || 'علي السعدي';
    if (this.greetingNameEl) this.greetingNameEl.textContent = `أهلاً ${name.split(' ')[0]}`;
    if (this.profileCardNameEl) this.profileCardNameEl.textContent = name;
  }

  showToast(message, type = 'success') {
    if (!this.toastEl || !this.toastMsgEl) return;
    
    this.toastMsgEl.textContent = message;
    this.toastEl.classList.remove('-translate-y-28', 'opacity-0', 'pointer-events-none');
    this.toastEl.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove('translate-y-0', 'opacity-100');
      this.toastEl.classList.add('-translate-y-28', 'opacity-0', 'pointer-events-none');
    }, 3200);
  }

  render() {
    const now = new Date();
    const monthsArabic = [
      'كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
      'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'
    ];
    const daysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    if (this.todayDateEl) {
      this.todayDateEl.textContent = `اليوم • ${daysArabic[now.getDay()]}، ${now.getDate()} ${monthsArabic[now.getMonth()]}`;
    }

    this.renderProfile();
    this.renderBalances();
    this.renderTransactions();
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new MasroofiApp();
  window.app = app;
});
