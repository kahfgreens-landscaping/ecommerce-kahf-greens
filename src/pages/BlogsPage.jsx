import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Filter,
  Leaf,
  Mail,
  Search,
  Share2,
  ShieldCheck,
  Sun,
  Tag,
  X,
  Droplets,
} from 'lucide-react';
import { BLOG_ARTICLES, BLOG_CATEGORIES } from '../data/blogArticles';
import { cn } from '../lib/utils';

function ArticleMeta({ article }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" />
        {article.date}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        {article.readTime}
      </span>
    </div>
  );
}

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleSlug, setActiveArticleSlug] = useState(null);
  const [savedArticles, setSavedArticles] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareError, setShareError] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const linkedArticleSlug = new URLSearchParams(location.search).get('article');
  const activeArticle = BLOG_ARTICLES.find(
    article => article.slug === (linkedArticleSlug || activeArticleSlug)
  ) || null;

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return BLOG_ARTICLES.filter(article => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = !query
        || article.title.toLowerCase().includes(query)
        || article.summary.toLowerCase().includes(query)
        || article.tags.some(tag => tag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (!activeArticle) return undefined;
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setActiveArticleSlug(null);
        if (linkedArticleSlug) navigate('/blogs', { replace: true });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticle, linkedArticleSlug, navigate]);

  const openArticle = article => setActiveArticleSlug(article.slug);

  function closeArticle() {
    setActiveArticleSlug(null);
    if (linkedArticleSlug) {
      navigate('/blogs', { replace: true });
    }
  }

  function toggleSaveArticle(event, articleId) {
    event.stopPropagation();
    setSavedArticles(previous => (
      previous.includes(articleId)
        ? previous.filter(id => id !== articleId)
        : [...previous, articleId]
    ));
  }

  async function handleShare() {
    if (!activeArticle) return;
    const articleUrl = `${window.location.origin}${window.location.pathname}#/blogs?article=${encodeURIComponent(activeArticle.slug)}`;
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopiedLink(true);
      setShareError('');
      window.setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(false);
      setShareError('Could not copy the link. You can copy it from your browser address bar.');
    }
  }

  function handleNewsletterSubmit(event) {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    const subject = encodeURIComponent('Kahf Greens journal newsletter');
    const body = encodeURIComponent(`Please add ${newsletterEmail.trim()} to the Kahf Greens newsletter.`);
    window.location.href = `mailto:shop@kahfgreens.ae?subject=${subject}&body=${body}`;
    setNewsletterMessage('Your email app should open with a subscription request. The sign-up form is not connected to a mailing service yet.');
  }

  const featuredArticle = selectedCategory === 'All' && !searchQuery.trim()
    ? BLOG_ARTICLES[0]
    : null;
  const gridArticles = featuredArticle
    ? filteredArticles.filter(article => article.id !== featuredArticle.id)
    : filteredArticles;

  return (
    <main className="bg-[#fcfbf8]">
      <section className="relative isolate overflow-hidden bg-[#29382e] text-white">
        <img
          src="/images/blogs/journal-hero-background.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#17251d]/65" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#17251d]/80 via-[#17251d]/55 to-[#17251d]/20" />
        <div className="container relative py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d7b27a]">
              <Leaf className="h-4 w-4" />
              The Kahf Greens Journal
            </p>
            <h1 className="max-w-3xl font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Botanical insights for <span className="italic text-[#d7b27a]">modern UAE living</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              Helpful ideas on choosing planters, caring for plants in the UAE climate, and creating considered green spaces at home.
            </p>
            <label className="relative mt-8 block max-w-xl">
              <span className="sr-only">Search articles</span>
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/55" />
              <input
                type="search"
                placeholder="Search materials, plant care, balcony design..."
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                className="w-full border border-white/20 bg-white/10 py-3.5 pl-12 pr-11 text-sm text-white placeholder:text-white/55 focus:border-[#d7b27a] focus:outline-none focus:ring-1 focus:ring-[#d7b27a]"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          </div>
        </div>
      </section>

      <section id="articles" className="container py-12 sm:py-16">
        <div className="mb-9 flex flex-col gap-5 border-b border-[#e8e4db] pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3 overflow-x-auto pb-1">
            <span className="hidden shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:flex">
              <Filter className="h-3.5 w-3.5" />
              Topics
            </span>
            {BLOG_CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'shrink-0 border px-4 py-2 text-xs transition-colors',
                  selectedCategory === category
                    ? 'border-brand-dark bg-brand-dark text-white'
                    : 'border-[#e8e4db] bg-white text-muted-foreground hover:border-brand-dark hover:text-brand-dark'
                )}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            Showing <strong className="text-brand-dark">{filteredArticles.length}</strong>
            {' '}{filteredArticles.length === 1 ? 'article' : 'articles'}
          </p>
        </div>

        {featuredArticle && (
          <article className="mb-12 grid overflow-hidden border border-[#e8e4db] bg-white lg:grid-cols-12">
            <button
              type="button"
              onClick={() => openArticle(featuredArticle)}
              className="group relative min-h-64 overflow-hidden bg-[#f0eee8] text-left lg:col-span-7 lg:min-h-[390px]"
              aria-label={`Read ${featuredArticle.title}`}
            >
              <img
                src={featuredArticle.featuredImage}
                alt={featuredArticle.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <span className="absolute left-5 top-5 bg-[#29382e] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white">
                Featured story
              </span>
            </button>
            <div className="flex flex-col justify-between p-6 sm:p-9 lg:col-span-5 lg:p-10">
              <div>
                <div className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-brand-sage">
                  <span>{featuredArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <h2 className="font-serif text-2xl font-medium leading-snug text-brand-dark sm:text-3xl">
                  {featuredArticle.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{featuredArticle.summary}</p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-[#e8e4db] pt-5">
                <div>
                  <p className="text-xs font-semibold text-brand-dark">{featuredArticle.author}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{featuredArticle.date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openArticle(featuredArticle)}
                  className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-brand-dark hover:text-brand-sage"
                >
                  Read story <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        )}

        {gridArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {gridArticles.map(article => (
              <article key={article.id} className="group flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f0eee8]">
                  <button
                    type="button"
                    onClick={() => openArticle(article)}
                    className="block h-full w-full"
                    aria-label={`Read ${article.title}`}
                  >
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </button>
                  <span className="absolute left-3 top-3 bg-[#fcfbf8]/95 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-dark">
                    {article.category}
                  </span>
                  <button
                    type="button"
                    aria-label={savedArticles.includes(article.id) ? 'Remove saved article' : 'Save article'}
                    aria-pressed={savedArticles.includes(article.id)}
                    onClick={event => toggleSaveArticle(event, article.id)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-[#fcfbf8]/90 text-brand-dark transition-colors hover:bg-white"
                  >
                    <Bookmark className={cn('h-4 w-4', savedArticles.includes(article.id) && 'fill-brand-dark')} />
                  </button>
                </div>
                <div className="flex flex-1 flex-col px-1 pt-4">
                  <ArticleMeta article={article} />
                  <button
                    type="button"
                    onClick={() => openArticle(article)}
                    className="mt-3 text-left font-serif text-xl font-medium leading-snug text-brand-dark transition-colors hover:text-brand-sage"
                  >
                    {article.title}
                  </button>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.summary}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-[#e8e4db] pt-4 mt-5">
                    <span className="text-xs text-muted-foreground">{article.author}</span>
                    <button
                      type="button"
                      onClick={() => openArticle(article)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-dark hover:text-brand-sage"
                    >
                      Read <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[#d9d4c8] bg-white px-6 py-16 text-center">
            <Search className="mx-auto h-8 w-8 text-brand-sage" />
            <h2 className="mt-4 font-serif text-2xl text-brand-dark">No stories found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              No articles match “{searchQuery}”. Try another search or reset your filters.
            </p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-5 border border-brand-dark px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-dark hover:bg-brand-dark hover:text-white"
            >
              Reset filters
            </button>
          </div>
        )}

        <section id="materials" className="relative mt-16 overflow-hidden bg-[#29382e] px-6 py-10 text-white sm:px-10 md:mt-20 md:px-14 md:py-14">
          <Leaf className="pointer-events-none absolute -bottom-12 -right-8 h-56 w-56 text-white/[0.06] sm:h-72 sm:w-72" />
          <div className="relative max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d7b27a]">A planter for every climate</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-tight sm:text-4xl">
              Made for life indoors and out in the UAE
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
              Explore thoughtful planter shapes, finishes, and sizes for balconies, gardens, and living spaces.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
              {[
                { icon: Sun, label: 'UAE climate considerations' },
                { icon: ShieldCheck, label: 'Quality-led selection' },
                { icon: Droplets, label: 'Practical drainage options' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 border border-white/15 bg-white/[0.06] px-3 py-3">
                  <Icon className="h-4 w-4 shrink-0 text-[#d7b27a]" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <Link to="/products" className="mt-7 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d7b27a] hover:text-white">
              Explore planters <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </section>

      {activeArticle && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={event => { if (event.target === event.currentTarget) closeArticle(); }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-article-title"
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-y-auto bg-[#fcfbf8] shadow-2xl"
          >
            <div className="relative min-h-64 bg-[#f0eee8] sm:min-h-80">
              <img src={activeArticle.featuredImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <button
                type="button"
                onClick={closeArticle}
                aria-label="Close article"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-[#fcfbf8]/95 text-brand-dark hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-6 left-5 right-5 text-white sm:bottom-8 sm:left-8 sm:right-8">
                <div className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/85">
                  <span className="text-[#e7c890]">{activeArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{activeArticle.readTime}</span>
                </div>
                <h2 id="blog-article-title" className="max-w-2xl font-serif text-2xl font-medium leading-tight sm:text-4xl">
                  {activeArticle.title}
                </h2>
              </div>
            </div>
            <div className="space-y-6 p-5 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e4db] pb-5">
                <div>
                  <p className="text-sm font-semibold text-brand-dark">{activeArticle.author}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{activeArticle.authorRole} · {activeArticle.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 border border-[#e8e4db] px-3 py-2 text-xs font-medium text-brand-dark hover:bg-[#f1eee7]"
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    {copiedLink ? 'Copied' : 'Share'}
                  </button>
                  <button
                    type="button"
                    aria-label={savedArticles.includes(activeArticle.id) ? 'Remove saved article' : 'Save article'}
                    aria-pressed={savedArticles.includes(activeArticle.id)}
                    onClick={event => toggleSaveArticle(event, activeArticle.id)}
                    className="flex h-9 w-9 items-center justify-center border border-[#e8e4db] text-brand-dark hover:bg-[#f1eee7]"
                  >
                    <Bookmark className={cn('h-4 w-4', savedArticles.includes(activeArticle.id) && 'fill-brand-dark')} />
                  </button>
                </div>
              </div>
              {shareError && <p role="status" className="text-xs text-red-700">{shareError}</p>}
              <div
                className="blog-article-content space-y-4 text-sm leading-7 text-[#55594f] sm:text-base"
                dangerouslySetInnerHTML={{ __html: activeArticle.content }}
              />
              <div className="flex flex-wrap items-center gap-2 border-t border-[#e8e4db] pt-5">
                <span className="mr-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" /> Topics
                </span>
                {activeArticle.tags.map(tag => (
                  <span key={tag} className="border border-[#e8e4db] px-2.5 py-1 text-[10px] text-muted-foreground">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[#e8e4db] pt-5">
                <p className="text-xs text-muted-foreground">Enjoyed this botanical guide?</p>
                <button
                  type="button"
                  onClick={closeArticle}
                  className="bg-brand-dark px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-brand-mid"
                >
                  Close story
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      <section id="newsletter" className="bg-[#f1eee7] py-14 sm:py-16">
        <div className="container max-w-3xl text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center bg-white text-brand-dark">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="mt-5 font-serif text-3xl font-medium text-brand-dark sm:text-4xl">A little more green in your inbox</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Get in touch to hear about seasonal plant care, thoughtful design, and new collections.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="mx-auto mt-7 flex max-w-lg flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="journal-email">Your email address</label>
            <input
              id="journal-email"
              type="email"
              required
              placeholder="Your email address"
              value={newsletterEmail}
              onChange={event => { setNewsletterEmail(event.target.value); setNewsletterMessage(''); }}
              className="min-w-0 flex-1 border border-[#dcd7cb] bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-sage focus:outline-none"
            />
            <button type="submit" className="inline-flex items-center justify-center gap-2 bg-brand-dark px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-mid">
              Email to subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {newsletterMessage && <p role="status" className="mt-3 text-xs text-muted-foreground">{newsletterMessage}</p>}
        </div>
      </section>
    </main>
  );
}
