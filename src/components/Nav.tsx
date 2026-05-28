import Arrow from "./Arrow";

export default function Nav() {
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="wordmark">
          Onmatch
        </a>
        <div className="nav-links">
          <a className="nav-link" href="#combo">
            What it does
          </a>
          <a className="nav-link" href="#how">
            How it works
          </a>
          <a className="nav-link" href="#tools">
            Tools
          </a>
          <a className="nav-link" href="#pricing">
            Pricing
          </a>
          <a className="nav-link" href="#faq">
            FAQ
          </a>
        </div>
        <a className="btn btn-sm" href="#cta">
          Request access <Arrow size={12} />
        </a>
      </div>
    </nav>
  );
}
