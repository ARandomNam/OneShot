import { useState } from'react';

const AICommandBox = () => {
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') {
        return;
        }
        setMessages([...messages, { text: newMessage, sender: 'user' }]);
        setNewMessage('');
        // Simulate response from another user after a short delay
        setTimeout(() => {
        setMessages([...messages, { text: 'Hello!', sender: 'other' }]);
        }, 500);
    };

    return (
        <div>
        <div className="commentbox">
            {messages.map((message, index) => (
            <div key={index} style={{ padding: '5px', textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                {message.text}
            </div>
            ))}
        </div>
        <form onSubmit={handleSubmit}>
        <div className="commentbox-userside">
            <input type="text" value={newMessage} onChange={handleInputChange} />
            <button type="submit">Send</button>
        </div>
        </form>
        </div>
    );
};

export default AICommandBox;