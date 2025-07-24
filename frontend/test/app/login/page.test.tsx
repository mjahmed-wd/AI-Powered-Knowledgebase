import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import LoginPage from '@/app/login/page';
import { Provider } from 'react-redux';
import { store } from '@/store';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Login Page', () => {
  const renderLoginPage = () => {
    return render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );
  };

  it('renders login form with all essential elements', () => {
    renderLoginPage();
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByText('create a new account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders form placeholders correctly', () => {
    renderLoginPage();
    
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });
}); 