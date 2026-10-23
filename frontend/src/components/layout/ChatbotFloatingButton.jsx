import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import './ChatbotFloatingButton.css';

function ChatbotFloatingButton({ isOpen = false, onClick }) {
	return (
		<button
			type="button"
			className={`chatbot-fab${isOpen ? ' is-open' : ''}`}
			aria-label={isOpen ? 'Close PharmaSense assistant' : 'Open PharmaSense assistant'}
			title="PharmaSense Assistant"
			onClick={onClick}
			aria-expanded={isOpen}
			aria-controls="pharmasense-chat-panel"
			aria-haspopup="dialog"
		>
			<span className="chatbot-fab-icon" aria-hidden="true">
				{isOpen ? <X size={23} strokeWidth={1.8} /> : <MessageCircle size={24} strokeWidth={1.8} />}
			</span>
			{!isOpen && <span className="chatbot-fab-label">Ask PharmaSense</span>}
		</button>
	);
}

export default ChatbotFloatingButton;
