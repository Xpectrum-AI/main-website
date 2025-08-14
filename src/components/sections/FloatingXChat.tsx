import React, { useState } from 'react';

const HeadsetMicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
const CallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const CallEndIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75L8.25 14.25m0 0l-1.5-1.5m1.5 1.5l1.5-1.5m3 3l-1.5-1.5m1.5 1.5l1.5-1.5M3 3l18 18" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;


export const NexusButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    // States: 'idle', 'connecting', 'active'
    const [callState, setCallState] = useState('idle');

    const handleCallClick = () => {
        setIsOpen(false);
        setCallState('connecting');
        setTimeout(() => {
            setCallState('active');
        }, 2000);
    };

    const handleEndCallClick = () => {
        setCallState('idle');
    };

    const handleChatClick = () => {
        setIsOpen(false);
        console.log("Opening chat...");
    };

    const renderMainButtonContent = () => {
        switch (callState) {
            case 'connecting':
                return <SpinnerIcon />;
            case 'active':
                return <CallEndIcon />;
            default:
                return <HeadsetMicIcon />;
        }
    };
    
    const mainButtonAction = callState === 'active' ? handleEndCallClick : () => setIsOpen(!isOpen);
    const mainButtonBg = callState === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-700';

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <div className="relative flex flex-col items-center">
                {/* Secondary Action Buttons */}
                <div 
                    className={`absolute bottom-full mb-4 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                >
                    <div className="flex flex-col items-center gap-4">
                        {/* Call Button */}
                        <button 
                            onClick={handleCallClick}
                            className="w-14 h-14 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-lg hover:bg-gray-700 transition-all transform hover:-translate-y-1"
                            aria-label="Start Call"
                        >
                            <CallIcon />
                        </button>
                        {/* Chat Button */}
                        <button
                            onClick={handleChatClick} 
                            className="w-14 h-14 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-lg hover:bg-gray-700 transition-all transform hover:-translate-y-1"
                            aria-label="Start Chat"
                        >
                            <ChatIcon />
                        </button>
                    </div>
                </div>

                {/* Main Floating Action Button */}
                <button
                    onClick={mainButtonAction}
                    className={`w-16 h-16 rounded-full text-white flex items-center justify-center shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-500 focus:ring-black transition-all duration-300 ease-in-out ${mainButtonBg}`}
                    aria-expanded={isOpen}
                    disabled={callState === 'connecting'}
                >
                    {renderMainButtonContent()}
                </button>
            </div>
        </div>
    );
};