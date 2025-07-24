import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import SignupPage from '@/app/signup/page';
import { Provider } from 'react-redux';
import { store } from '@/store';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Signup Page', () => {
  const renderSignupPage = () => {
    return render(
      <Provider store={store}>
        <SignupPage />
      </Provider>
    );
  };

  it('renders signup form with essential elements', () => {
    renderSignupPage();

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText('sign in to your existing account')).toBeInTheDocument();
  });

  it('renders form inputs', () => {
    renderSignupPage();
    
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
  });

  it('renders terms and conditions checkbox', () => {
    renderSignupPage();
    
    expect(screen.getByRole('checkbox', { name: /terms/i })).toBeInTheDocument();
  });
}); 