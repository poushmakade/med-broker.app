import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Sparkles, X, Plus } from 'lucide-react';
import aiService from '../../services/ai.service';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrency } from '../../utils/currency';
import './ChatbotPanel.css';

function ChatbotPanel({ isOpen, onClose }) {
	const { addToCart } = useCart();
	const { user } = useUser();
	const { currency } = useCurrency();
	const [messages, setMessages] = useState([
		{
			id: 'welcome',
			role: 'assistant',
			text: 'Hello, I’m your PharmaSense assistant. I can help you explore the catalog, understand your next steps, or find general health information.',
			products: [],
			timestamp: new Date().toISOString()
		}
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);
	const panelRef = useRef(null);
	const inputRef = useRef(null);

	const currencyCode = currency || localStorage.getItem('preferredCurrency') || 'INR';
	const formatProductPrice = (product) => {
		const value = Number(product?.displayPrice ?? product?.retailPrice ?? 0);
		const code = product?.displayCurrencyCode || currencyCode;
		return formatCurrency(value, code, true);
	};

	const quickPrompts = useMemo(() => [
		'I have fever and headache since yesterday',
		'I have sore throat and dry cough',
		'How do I place an order?'
	], []);

	const handleAddRecommendedProduct = (product) => {
		if (product.isDemo || product.purchasable === false || product.inStock === false) return;
		const buyerType = user?.customer?.buyerType || 'RETAIL';
		addToCart(
			{
				id: product.id,
				medicineId: product.medicineId,
				name: product.name,
				category: 'Recommended',
				imageUrl: product.imageUrl,
				vendor: product.vendor,
				vendorId: product.vendorId
			},
			1,
			product.retailPrice,
			product.wholesalePrice,
			buyerType,
			product.baseCurrencyCode || product.currencyCode || 'INR',
			'standard',
			product.bulkPrice,
			product.bulkMinQty
		);
	};

	useEffect(() => {
		if (!isOpen) return;
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		messagesEndRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
	}, [messages, isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const previousFocus = document.activeElement;
		inputRef.current?.focus();
		const onEscape = (event) => {
			if (event.key === 'Escape') {
				onClose();
			}
			if (event.key === 'Tab') {
				const focusable = Array.from(panelRef.current?.querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex="0"]') || []);
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (event.shiftKey && (document.activeElement === first || !panelRef.current?.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
				else if (!event.shiftKey && (document.activeElement === last || !panelRef.current?.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
			}
		};

		window.addEventListener('keydown', onEscape);
		return () => { window.removeEventListener('keydown', onEscape); previousFocus?.focus?.(); };
	}, [isOpen, onClose]);

	// Capture the opening trigger above before any autofocus effect runs.
	useEffect(() => {
		if (isOpen && !isLoading) inputRef.current?.focus();
	}, [isOpen, isLoading]);

	if (!isOpen) {
		return null;
	}

	const sendMessage = async (text) => {
		const normalized = String(text || '').trim();
		if (!normalized || isLoading) return;

		const userMessage = {
			id: `user-${Date.now()}`,
			role: 'user',
			text: normalized,
			timestamp: new Date().toISOString()
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput('');
		setIsLoading(true);

		try {
			const { reply, products = [] } = await aiService.sendMessage({
				message: normalized,
				context: {
					channel: 'chatbot-widget',
					buyerType: user?.customer?.buyerType || 'RETAIL',
					preferredCurrency: currencyCode
				}
			});

			setMessages((prev) => [
				...prev,
				{
					id: `assistant-${Date.now()}`,
					role: 'assistant',
					text: reply,
					products,
					timestamp: new Date().toISOString()
				}
			]);
		} catch (_error) {
			setMessages((prev) => [
				...prev,
				{
					id: `assistant-error-${Date.now()}`,
					role: 'assistant',
					text: 'I could not process that right now. Please try again in a moment.',
					products: [],
					timestamp: new Date().toISOString()
				}
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		await sendMessage(input);
	};

	return (
		<>
			<div className="chatbot-panel-backdrop" onClick={onClose} aria-hidden="true" />
			<section id="pharmasense-chat-panel" ref={panelRef} className="chatbot-panel" role="dialog" aria-modal="true" aria-labelledby="pharmasense-chat-title" aria-describedby="pharmasense-chat-subtitle">
				<header className="chatbot-panel-header">
					<span className="chatbot-header-avatar" aria-hidden="true"><Sparkles size={22} strokeWidth={1.7} /></span>
					<div className="chatbot-panel-title-wrap">
						<p className="chatbot-panel-kicker">A little clarity, anytime</p>
						<h3 id="pharmasense-chat-title" className="chatbot-panel-title">Your PharmaSense assistant</h3>
						<p id="pharmasense-chat-subtitle" className="chatbot-panel-subtitle">Catalog help &amp; thoughtful guidance</p>
					</div>
					<button type="button" className="chatbot-panel-close" onClick={onClose} aria-label="Close chatbot">
						<X size={19} strokeWidth={1.8} aria-hidden="true" />
					</button>
				</header>

				<div className="chatbot-panel-prompts">
					<p className="chatbot-prompts-label">A place to start</p>
					<div className="chatbot-prompts-grid">
					{quickPrompts.map((prompt) => (
						<button
							key={prompt}
							type="button"
							className="chatbot-prompt-chip"
							onClick={() => sendMessage(prompt)}
							disabled={isLoading}
						>
							{prompt}
						</button>
					))}
					</div>
				</div>

				<div className="chatbot-messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
					{messages.map((msg) => (
						<div key={msg.id} className={`chatbot-message-row ${msg.role === 'user' ? 'user' : 'assistant'}`}>
							<div className={`chatbot-message-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}>
								<span className="chatbot-message-author">{msg.role === 'user' ? 'You' : 'PharmaSense'}</span>
								<p className="chatbot-message-text">{msg.text}</p>
								{msg.role === 'assistant' && Array.isArray(msg.products) && msg.products.length > 0 && (
									<div className="chatbot-products-list">
										{msg.products.map((product) => (
											<div key={`${msg.id}-${product.id}`} className="chatbot-product-card">
												<div className="chatbot-product-main">
													<p className="chatbot-product-name">{product.name}</p>
													<p className="chatbot-product-meta">
														{product.isDemo ? 'Demo listing • not available for purchase' : `${product.vendor} • ${product.requiresPrescription ? 'Rx Required' : 'OTC'}`}
													</p>
													<p className="chatbot-product-price">{formatProductPrice(product)}</p>
												</div>
												<button
													type="button"
													className="chatbot-product-add"
													disabled={product.isDemo || product.purchasable === false || product.inStock === false}
													onClick={() => handleAddRecommendedProduct(product)}
												>
													<Plus size={13} aria-hidden="true" /> {product.isDemo ? 'Demo only' : 'Add to cart'}
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					))}
					{isLoading && (
						<div className="chatbot-message-row assistant">
							<div className="chatbot-message-bubble assistant typing" role="status" aria-label="PharmaSense is replying">
								<span aria-hidden="true" />
								<span aria-hidden="true" />
								<span aria-hidden="true" />
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				<form className="chatbot-input-row" onSubmit={handleSubmit}>
					<input
						ref={inputRef}
						type="text"
						aria-label="Message PharmaSense assistant"
						maxLength={4000}
						value={input}
						onChange={(event) => setInput(event.target.value)}
						placeholder="What can I help you with?"
						className="chatbot-input"
						disabled={isLoading}
					/>
					<button
						type="submit"
						className="chatbot-send"
						aria-label="Send message"
						disabled={!input.trim() || isLoading}
					>
						<ArrowUp size={20} strokeWidth={2} aria-hidden="true" />
					</button>
				</form>
				<p className="chatbot-disclaimer">General information, not a diagnosis.</p>
			</section>
		</>
	);
}

export default ChatbotPanel;