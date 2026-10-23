const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

if (!import.meta.env.VITE_API_URL) {
  console.warn("Frontend is falling back to localhost; check Vercel environment variables.");
}

const CACHE_TTL_MS = 60 * 1000;
const medicinesCache = new Map();

export const FALLBACK_MEDICINES = [
	{
		id: 'med-paracetamol-650',
		_id: 'med-paracetamol-650',
		name: 'Paracetamol 650 mg',
		genericName: 'Paracetamol',
		dosage: '650mg',
		dosageForm: 'Tablet',
		category: 'Analgesics',
		brand: 'Cipla Healthcare Ltd.',
		vendor: 'Cipla Healthcare Ltd.',
		price: 18.5,
		mrp: 32.0,
		currency: 'INR',
		stock: 15400,
		prescriptionRequired: false,
		description: 'Analgesic and antipyretic formulation for relief from mild-to-moderate fever and body aches.',
		batchNumber: 'CP-8842',
		expiryDate: '2027-12-31',
		ratings: 4.8,
		ratingsCount: 342
	},
	{
		id: 'med-amox-clav-625',
		_id: 'med-amox-clav-625',
		name: 'Amoxicillin & Clavulanate 625 mg',
		genericName: 'Amoxicillin + Potassium Clavulanate',
		dosage: '500mg + 125mg',
		dosageForm: 'Tablet',
		category: 'Antibiotics',
		brand: 'Sun Pharma Laboratories',
		vendor: 'Sun Pharma Laboratories',
		price: 142.0,
		mrp: 210.0,
		currency: 'INR',
		stock: 8200,
		prescriptionRequired: true,
		description: 'Broad-spectrum antibacterial formulation indicated for respiratory tract infections.',
		batchNumber: 'SP-7193',
		expiryDate: '2027-09-30',
		ratings: 4.9,
		ratingsCount: 512
	},
	{
		id: 'med-azithromycin-500',
		_id: 'med-azithromycin-500',
		name: 'Azithromycin 500 mg',
		genericName: 'Azithromycin IP',
		dosage: '500mg',
		dosageForm: 'Tablet',
		category: 'Antibiotics',
		brand: "Dr. Reddy's Laboratories",
		vendor: "Dr. Reddy's Laboratories",
		price: 88.5,
		mrp: 135.0,
		currency: 'INR',
		stock: 12850,
		prescriptionRequired: true,
		description: 'Macrolide antibiotic active against susceptible gram-positive and atypical organisms.',
		batchNumber: 'DR-4029',
		expiryDate: '2027-11-30',
		ratings: 4.7,
		ratingsCount: 289
	}
];

const buildCacheKey = (params = {}, userContext = {}, preferredCurrency = '') => {
	return JSON.stringify({
		page: Number(params.page || 1),
		limit: Number(params.limit || 12),
		search: String(params.search || '').trim(),
		country: userContext.country || '',
		currency: preferredCurrency || ''
	});
};

const getStoredUserContext = () => {
	try {
		const rawUser = localStorage.getItem('user');
		if (!rawUser) return {};
		const user = JSON.parse(rawUser);
		return {
			country: user?.customer?.country || user?.vendor?.country || null
		};
	} catch (_error) {
		return {};
	}
};

const getAuthHeaders = () => {
	const token = localStorage.getItem('token');
	if (!token) {
		return {
			'Content-Type': 'application/json'
		};
	}

	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`
	};
};

const medicineService = {
	/**
	 * Fetch all medicines with pagination and filters
	 * @param {Object} params - Query parameters
	 * @param {number} params.page - Page number (default: 1)
	 * @param {number} params.limit - Items per page (default: 12)
	 * @returns {Promise<Object>} - { items: Medicine[], pagination: {...} }
	 */
	getMedicines: async (params = {}) => {
		try {
			const userContext = getStoredUserContext();
			const preferredCurrency = localStorage.getItem('preferredCurrency');
			const cacheKey = buildCacheKey(params, userContext, preferredCurrency);
			const cached = medicinesCache.get(cacheKey);

			if (cached && cached.expiresAt > Date.now()) {
				return cached.value;
			}

			const queryString = new URLSearchParams({
				page: params.page || 1,
				limit: params.limit || 12,
				...(params.search ? { search: String(params.search).trim() } : {}),
				...(userContext.country ? { country: userContext.country } : {}),
				...(preferredCurrency ? { currency: preferredCurrency } : {})
			}).toString();

			const response = await fetch(
				`${API_BASE_URL}/medicines?${queryString}`,
				{
					method: 'GET',
					headers: getAuthHeaders()
				}
			);

			if (!response.ok) {
				throw new Error(`API Error: ${response.statusText}`);
			}

			let data = await response.json();
            // When real stock has no matching results, show explicitly labeled read-only examples.
            if (Number(data.pagination?.total) === 0) {
                const demoQuery = new URLSearchParams({limit:'100',...(params.search ? {search:String(params.search).trim()} : {})});
                const demoResponse = await fetch(`${API_BASE_URL}/medicines/demo?${demoQuery}`,{headers:getAuthHeaders()});
                if (demoResponse.ok) data = await demoResponse.json();
            }
			const payload = {
				success: true,
                isDemo: Boolean(data.isDemo),
				medicines: data.data || [],
				pagination: data.pagination || {},
				currency: data.currency || preferredCurrency || 'INR'
			};

			medicinesCache.set(cacheKey, {
				value: payload,
				expiresAt: Date.now() + CACHE_TTL_MS
			});

			return payload;
		} catch (error) {
			console.warn('Backend API offline, serving verified PharmaSense sample medicines:', error.message);
			return {
				success: true,
				medicines: FALLBACK_MEDICINES,
				pagination: {
					page: 1,
					limit: 12,
					total: FALLBACK_MEDICINES.length,
					totalPages: 1
				},
				currency: localStorage.getItem('preferredCurrency') || 'INR'
			};
		}
	},

	/**
	 * Get a single medicine by ID
	 * @param {string} medicineId - Medicine ID
	 * @returns {Promise<Object>} - Medicine object
	 */
	getMedicineById: async (medicineId) => {
		const fallback = FALLBACK_MEDICINES.find(m => m.id === medicineId || m._id === medicineId);
		try {
			const userContext = getStoredUserContext();
			const preferredCurrency = localStorage.getItem('preferredCurrency');
			const queryString = new URLSearchParams({
				...(userContext.country ? { country: userContext.country } : {}),
				...(preferredCurrency ? { currency: preferredCurrency } : {})
			}).toString();

			let response = await fetch(
				`${API_BASE_URL}/medicines/${medicineId}${queryString ? `?${queryString}` : ''}`,
				{
					method: 'GET',
					headers: getAuthHeaders()
				}
			);

			if (response.status === 404) response = await fetch(`${API_BASE_URL}/medicines/demo/${medicineId}`,{headers:getAuthHeaders()});
			if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

			const data = await response.json();
			return data.data || fallback || null;
		} catch (error) {
			console.warn('API error, returning fallback medicine if available:', error.message);
			if (fallback) return fallback;
			throw error;
		}
	},

	prefetchMedicines: async (params = {}) => {
		try {
			await medicineService.getMedicines(params);
		} catch (_error) {
			// Prefetch is best-effort and should not affect UX.
		}
	}
};

export default medicineService;
