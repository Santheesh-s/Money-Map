// Home.jsx - Public landing page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdInsights, MdSecurity, MdTrendingUp, MdDashboard, MdBolt, MdLogin, MdOutlineCategory, MdSavings, MdSchedule } from 'react-icons/md';
import './Home.css';

const Feature = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Top Navigation */}
      <header className="topnav">
        <div className="brand" onClick={() => navigate('/')}>Money Map</div>
        <nav>
          <button className="link" onClick={() => navigate('/dashboard')}><MdDashboard size={18} /> Dashboard</button>
          <button className="link" onClick={() => navigate('/budgets')}><MdOutlineCategory size={18} /> Budgets</button>
          <button className="primary small" onClick={() => navigate('/auth')}><MdLogin size={18} /> Login / Register</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Personal Finance, <span>Made Effortless</span>
          </h1>
          <p>
            Track expenses, set budgets, analyze trends, and reach your goals with a modern, privacy‑first personal finance assistant.
          </p>
          <div className="hero-cta">
            <button className="primary" onClick={() => navigate('/auth')}>Get Started</button>
            <button className="secondary" onClick={() => navigate('/dashboard')}>
              <MdDashboard size={18} /> View Dashboard
            </button>
          </div>
          <div className="hero-meta">
            <span><MdSecurity size={16} /> Secure by design</span>
            <span><MdBolt size={16} /> Fast, responsive UI</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden>
          <div className="glass-card">
            <div className="kpi">
              <span>Monthly Spend</span>
              <strong>₹ 42,350</strong>
            </div>
            <div className="kpi">
              <span>Savings Rate</span>
              <strong>23%</strong>
            </div>
            <div className="trend">
              <MdTrendingUp size={20} /> Positive trend this quarter
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Strip */}
      <section className="stats">
        <div className="stat">
          <strong>5000+</strong>
          <span>Transactions Tracked</span>
        </div>
        <div className="stat">
          <strong>92%</strong>
          <span>User Satisfaction</span>
        </div>
        <div className="stat">
          <strong>30%</strong>
          <span>Avg. Expense Reduction</span>
        </div>
        <div className="stat">
          <strong>1 min</strong>
          <span>To Get Started</span>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <Feature
          icon={<MdInsights size={26} color="#1976d2" />}
          title="Clear Insights"
          description="Beautiful charts and summaries help you understand where your money goes."
        />
        <Feature
          icon={<MdTrendingUp size={26} color="#00b894" />}
          title="Smart Budgets"
          description="Create monthly and category budgets, and stay on track with gentle nudges."
        />
        <Feature
          icon={<MdSecurity size={26} color="#ff9800" />}
          title="Private & Secure"
          description="Your data stays yours. We use secure best‑practices across the stack."
        />
        <Feature
          icon={<MdSavings size={26} color="#6c5ce7" />}
          title="Goal Tracking"
          description="Define saving goals and monitor progress with motivating milestones."
        />
        <Feature
          icon={<MdSchedule size={26} color="#e17055" />}
          title="Recurring Plans"
          description="Automate recurring expenses and incomes for accurate monthly views."
        />
      </section>

      {/* Logos/Trust strip */}
      <section className="logos">
        <span>Trusted by proactive individuals and small teams</span>
        <div className="logo-row">
          <div className="logo-pill">FinWell</div>
          <div className="logo-pill">MoneyMate</div>
          <div className="logo-pill">BudgetPro</div>
          <div className="logo-pill">Trackly</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="testimonial">
          <p>“I cut discretionary spending by 27% within two months. The insights are incredibly clear.”</p>
          <span>— Aisha, Product Manager</span>
        </div>
        <div className="testimonial">
          <p>“Finally a budgeting tool that feels modern and respectful of my time and privacy.”</p>
          <span>— Rohan, Entrepreneur</span>
        </div>
        <div className="testimonial">
          <p>“The dashboard gives me exactly what I need every morning. Love the simplicity.”</p>
          <span>— Meera, Analyst</span>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <h3>Ready to take control of your finances?</h3>
        <div className="cta-buttons">
          <button className="primary" onClick={() => navigate('/auth')}>Create your account</button>
          <button className="ghost" onClick={() => navigate('/dashboard')}>Explore the app</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="brand">Money Map</div>
            <p>Modern money manager to plan, track and grow.</p>
          </div>
          <div>
            <h5>Product</h5>
            <ul>
              <li><button className="text" onClick={() => navigate('/dashboard')}>Dashboard</button></li>
              <li><button className="text" onClick={() => navigate('/budgets')}>Budgets</button></li>
              <li><button className="text" onClick={() => navigate('/history')}>Transactions</button></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><button className="text" onClick={() => navigate('/auth')}>Get Started</button></li>
              <li><button className="text" onClick={() => navigate('/')}>Home</button></li>
            </ul>
          </div>
        </div>
        <div className="footnote">© {new Date().getFullYear()} Money Map. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home;


