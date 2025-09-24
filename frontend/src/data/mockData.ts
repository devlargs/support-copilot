export interface SupportResponse {
    id: string
    question: string
    answer: string
    createdAt: string
}

export const mockSupportData: SupportResponse[] = [
    {
        id: '1',
        question: 'How do I reset my password?',
        answer: 'To reset your password, go to the login page and click on "Forgot Password". Enter your email address and follow the instructions sent to your email.',
        createdAt: '2024-01-15T10:30:00Z'
    },
    {
        id: '2',
        question: 'What are the system requirements?',
        answer: 'Our application requires Windows 10 or later, macOS 10.15 or later, or Ubuntu 18.04 LTS. You need at least 4GB RAM and 2GB free disk space.',
        createdAt: '2024-01-14T14:20:00Z'
    },
    {
        id: '3',
        question: 'How can I export my data?',
        answer: 'You can export your data by going to Settings > Data Management > Export. Choose your preferred format (CSV, JSON, or PDF) and click Export.',
        createdAt: '2024-01-13T09:15:00Z'
    },
    {
        id: '4',
        question: 'Is there a mobile app available?',
        answer: 'Yes, we have mobile apps available for both iOS and Android. You can download them from the App Store or Google Play Store.',
        createdAt: '2024-01-12T16:45:00Z'
    },
    {
        id: '5',
        question: 'How do I contact customer support?',
        answer: 'You can contact our customer support team through email at support@company.com, phone at 1-800-SUPPORT, or through our live chat feature.',
        createdAt: '2024-01-11T11:30:00Z'
    },
    {
        id: '6',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely.',
        createdAt: '2024-01-10T13:20:00Z'
    },
    {
        id: '7',
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time. Go to your account settings and click on "Cancel Subscription". You will retain access until the end of your billing period.',
        createdAt: '2024-01-09T08:45:00Z'
    },
    {
        id: '8',
        question: 'How do I update my profile information?',
        answer: 'To update your profile, click on your avatar in the top right corner, select "Profile Settings", make your changes, and click "Save Changes".',
        createdAt: '2024-01-08T15:10:00Z'
    },
    {
        id: '9',
        question: 'What is your refund policy?',
        answer: 'We offer a 30-day money-back guarantee for all new subscriptions. If you are not satisfied, contact our support team within 30 days for a full refund.',
        createdAt: '2024-01-07T12:30:00Z'
    },
    {
        id: '10',
        question: 'How do I enable two-factor authentication?',
        answer: 'Go to Security Settings in your account, click on "Two-Factor Authentication", and follow the setup instructions. You can use an authenticator app or SMS.',
        createdAt: '2024-01-06T17:25:00Z'
    }
]
