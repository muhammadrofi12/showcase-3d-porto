import React, {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  X,
  Grid2X2,
  Map,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  Mouse,
  LoaderCircle,
  BookOpen,
  Sparkles,
  Compass,
  MessageSquare,
  Sun,
  Moon,
} from "lucide-react";
import {
  aiCatalogUrl,
  aiVisuals as initialAiVisuals,
  buildFeatured,
  buildPlacements,
  getRoomEntryStation,
  initialGuestbookEntries,
  interiorRooms,
  projects as initialProjects,
  rooms,
  stations,
  shortTitle,
  status,
} from "./content";
import type { AiVisual, LobbyViewpointId, Project } from "./content";
import { fetchPortfolioFromApi } from "./services/portfolioApi";
import { galleryAudio } from "./audio";
import "./style.css";

const Scene = lazy(() => import("./Scene"));

class SceneBoundary extends Component<
  { children: React.ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function App() {
  const reduced = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current;
  const [hour, setHour] = useState(10);
  const [monasView, setMonasView] = useState(0);
  const [eventView, setEventView] = useState(0);
  const [eventArea, setEventArea] = useState("overview");
  const [skyView, setSkyView] = useState<{ id: number; hour: number } | null>(
    null,
  );
  const [station, setStation] = useState(0),
    [lobbyView, setLobbyView] = useState<LobbyViewpointId>("wide"),
    [greetingOpen, setGreetingOpen] = useState(false),
    [catalog, setCatalog] = useState(window.innerWidth < 768 || reduced),
    [openedFromBook, setOpenedFromBook] = useState(false),
    [collection, setCollection] = useState<"software" | "ai">("software"),
    [selected, setSelected] = useState<Project | null>(null),
    [selectedVisualIndex, setSelectedVisualIndex] = useState<number | null>(
      null,
    ),
    [about, setAbout] = useState(false),
    [mapOpen, setMapOpen] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [low, setLow] = useState(window.innerWidth < 768),
    [category, setCategory] = useState("Semua"),
    [search, setSearch] = useState(""),
    [imageIndex, setImageIndex] = useState(0),
    [slow, setSlow] = useState(false),
    [soundOn, setSoundOn] = useState(false),
    [snapCount, setSnapCount] = useState(0),
    [blinkPhase, setBlinkPhase] = useState<"idle" | "closing" | "opening">(
      "idle",
    ),
    [guestbookEntries, setGuestbookEntries] = useState(() => {
      try {
        const saved = localStorage.getItem("ruang-karya-guestbook");
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore storage errors
      }
      return initialGuestbookEntries;
    }),
    [guestName, setGuestName] = useState(""),
    [guestEmail, setGuestEmail] = useState(""),
    [guestMessage, setGuestMessage] = useState(""),
    [guestSaved, setGuestSaved] = useState(false),
    [projects, setProjects] = useState<Project[]>(initialProjects),
    [aiVisuals, setAiVisuals] = useState<AiVisual[]>(initialAiVisuals);

  const featured = useMemo(() => buildFeatured(projects), [projects]);
  const placements = useMemo(() => buildPlacements(projects), [projects]);

  useEffect(() => {
    let activeMount = true;
    fetchPortfolioFromApi("id").then((res) => {
      if (!activeMount) return;
      if (res.projects.length) setProjects(res.projects);
      if (res.aiVisuals.length) setAiVisuals(res.aiVisuals);
    });
    return () => {
      activeMount = false;
    };
  }, []);

  const [sceneEnabled, setSceneEnabled] = useState(
    window.innerWidth >= 768 && !reduced,
  );

  const mainRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const blinkTimers = useRef<number[]>([]);
  const userMutedRef = useRef(false);
  const touchStart = useRef({ x: 0, y: 0 });
  const dialog = useRef<HTMLDialogElement>(null),
    visualDialog = useRef<HTMLDialogElement>(null),
    catalogDialog = useRef<HTMLDialogElement>(null),
    aboutDialog = useRef<HTMLDialogElement>(null),
    lastWheel = useRef(0);

  const rememberTrigger = useCallback((el?: HTMLElement | null) => {
    if (el) {
      lastTriggerRef.current = el;
    } else if (
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
    ) {
      lastTriggerRef.current = document.activeElement;
    }
  }, []);

  const restoreFocus = useCallback(() => {
    requestAnimationFrame(() => {
      if (
        lastTriggerRef.current &&
        document.body.contains(lastTriggerRef.current)
      ) {
        lastTriggerRef.current.focus();
      } else {
        mainRef.current?.focus();
      }
    });
  }, []);

  useEffect(() => {
    if (!catalog) setSceneEnabled(true);
  }, [catalog]);

  useEffect(() => {
    const onVis = () => galleryAudio.pauseForHiddenTab(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const ensureAudioOnEntry = useCallback(
    (silent = false) => {
      galleryAudio.unlockContext();
      if (!galleryAudio.isEnabled() && !userMutedRef.current && !reduced) {
        const next = galleryAudio.setEnabled(true, silent);
        setSoundOn(next);
      }
    },
    [reduced],
  );

  useEffect(() => {
    const unlockOnGesture = () => {
      galleryAudio.unlockContext();
    };
    window.addEventListener("pointerdown", unlockOnGesture, { passive: true });
    window.addEventListener("keydown", unlockOnGesture, { passive: true });
    window.addEventListener("touchstart", unlockOnGesture, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlockOnGesture);
      window.removeEventListener("keydown", unlockOnGesture);
      window.removeEventListener("touchstart", unlockOnGesture);
    };
  }, []);

  const currentStation = stations[station];
  const room = currentStation.room;
  const active = currentStation.project;
  const inLobby = room === 1;
  const inAiRoom = room === 5;
  const onAiShelfStation = Boolean(currentStation.aiRoom);
  const isRoomOverview = Boolean(currentStation.roomOverview);
  const inGuestbookRoom = room === 6;
  const selectedVisual =
    selectedVisualIndex !== null ? aiVisuals[selectedVisualIndex] : null;
  const busy = catalog || !!selected || selectedVisual !== null || about;
  const totalInteriorStations = stations.length - 1;

  const clearBlinkTimers = useCallback(() => {
    blinkTimers.current.forEach((id) => clearTimeout(id));
    blinkTimers.current = [];
  }, []);

  const go = useCallback(
    (i: number, withBlink = false) => {
      const next = Math.max(0, Math.min(stations.length - 1, i));
      if (next === station) {
        setMapOpen(false);
        return;
      }
      ensureAudioOnEntry(true);
      setEventView(0);
      const nextStation = stations[next];
      if (withBlink && !reduced) {
        clearBlinkTimers();
        galleryAudio.playBlink();
        setBlinkPhase("closing");
        const t1 = window.setTimeout(() => {
          setSnapCount((c) => c + 1);
          setStation(next);
          setLobbyView("wide");
          setMapOpen(false);
        }, 520);
        const t2 = window.setTimeout(() => {
          setBlinkPhase("opening");
        }, 650);
        const t3 = window.setTimeout(() => {
          setBlinkPhase("idle");
        }, 1480);
        blinkTimers.current = [t1, t2, t3];
      } else {
        if (nextStation.roomOverview) {
          galleryAudio.playRoomScroll();
        } else {
          galleryAudio.playProjectScroll();
        }
        setStation(next);
        setLobbyView("wide");
        setMapOpen(false);
      }
    },
    [station, reduced, clearBlinkTimers, ensureAudioOnEntry],
  );

  const goToRoom = useCallback(
    (roomIndex: number) => {
      const target = getRoomEntryStation(roomIndex);
      go(target, true);
    },
    [go],
  );

  const toggleSound = useCallback(() => {
    const next = galleryAudio.toggle();
    userMutedRef.current = !next;
    setSoundOn(next);
  }, []);

  const openGeneralCatalog = useCallback(
    (trigger?: HTMLElement | null) => {
      rememberTrigger(trigger);
      galleryAudio.playBook();
      setOpenedFromBook(false);
      setCatalog(true);
    },
    [rememberTrigger],
  );

  const openBookCatalog = useCallback(
    (trigger?: HTMLElement | null) => {
      rememberTrigger(trigger);
      galleryAudio.playBook();
      setOpenedFromBook(true);
      setCatalog(true);
    },
    [rememberTrigger],
  );

  const closeCatalog = useCallback(() => {
    galleryAudio.playClick();
    setCatalog(false);
    setOpenedFromBook(false);
    restoreFocus();
  }, [restoreFocus]);

  const choose = useCallback(
    (p: Project, trigger?: HTMLElement | null) => {
      rememberTrigger(trigger);
      ensureAudioOnEntry(true);
      galleryAudio.playProjectScroll();
      setImageIndex(0);
      setSelected(p);
    },
    [rememberTrigger, ensureAudioOnEntry],
  );

  const closeProject = useCallback(() => {
    galleryAudio.playClick();
    setSelected(null);
    restoreFocus();
  }, [restoreFocus]);

  const chooseVisual = useCallback(
    (v: AiVisual, trigger?: HTMLElement | null) => {
      rememberTrigger(trigger);
      ensureAudioOnEntry(true);
      galleryAudio.playProjectScroll();
      const idx = aiVisuals.findIndex((item) => item.id === v.id);
      setSelectedVisualIndex(idx >= 0 ? idx : 0);
    },
    [rememberTrigger, ensureAudioOnEntry, aiVisuals],
  );

  const closeVisual = useCallback(() => {
    galleryAudio.playClick();
    setSelectedVisualIndex(null);
    restoreFocus();
  }, [restoreFocus]);

  const handleInspectBoard = useCallback(
    (trigger?: HTMLElement | null) => {
      rememberTrigger(trigger);
      galleryAudio.playClick();
      if (station !== 1) setStation(1);
      setLobbyView("board");
      setMapOpen(true);
    },
    [rememberTrigger, station],
  );

  const handleGreetStaff = useCallback(() => {
    galleryAudio.playGreet();
    setGreetingOpen(true);
  }, []);

  const handleGuestbookSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const nameTrimmed = guestName.trim() || "Guest";
      const msgTrimmed = guestMessage.trim() || "Lovely exhibition!";
      const formatted = `${msgTrimmed.slice(0, 26)} — ${nameTrimmed.slice(0, 14)}`;
      const updated = [{ text: formatted }, ...guestbookEntries.slice(0, 7)];
      setGuestbookEntries(updated);
      try {
        localStorage.setItem("ruang-karya-guestbook", JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      galleryAudio.playGreet();
      setGuestName("");
      setGuestEmail("");
      setGuestMessage("");
      setGuestSaved(true);
      setTimeout(() => setGuestSaved(false), 4500);
    },
    [guestName, guestMessage, guestbookEntries],
  );

  useEffect(() => {
    if (!inLobby) setGreetingOpen(false);
  }, [inLobby]);

  useEffect(() => {
    if (!greetingOpen) return;
    const t = setTimeout(() => setGreetingOpen(false), 6000);
    return () => clearTimeout(t);
  }, [greetingOpen]);

  const sceneReady = useCallback(() => setReady(true), []);
  const sceneError = useCallback(() => {
    setFailed(true);
    setCatalog(true);
  }, []);

  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);

  useEffect(() => {
    if (selectedVisual) visualDialog.current?.showModal();
    else visualDialog.current?.close();
  }, [selectedVisual]);

  useEffect(() => {
    if (catalog) catalogDialog.current?.showModal();
    else catalogDialog.current?.close();
  }, [catalog]);

  useEffect(() => {
    if (about) aboutDialog.current?.showModal();
    else aboutDialog.current?.close();
  }, [about]);

  useEffect(() => {
    const onLost = () => sceneError();
    window.addEventListener("gallery-context-lost", onLost);
    const timer = setTimeout(() => setSlow(true), 10000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("gallery-context-lost", onLost);
    };
  }, [sceneError]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (busy || e.ctrlKey || Math.abs(e.deltaY) < 8) return;
      e.preventDefault();
      if (performance.now() - lastWheel.current > 850) {
        go(station + (e.deltaY > 0 ? 1 : -1));
        lastWheel.current = performance.now();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [station, busy, go]);

  const visible = projects.filter(
    (p) =>
      (category === "Semua" || p.categories.includes(category)) &&
      `${p.title} ${p.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const activeRoom = rooms[room];

  return (
    <main
      ref={mainRef}
      onTouchStart={(e) => {
        touchStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }}
      onTouchEnd={(e) => {
        if (busy) return;
        const dy = touchStart.current.y - e.changedTouches[0].clientY;
        const dx = touchStart.current.x - e.changedTouches[0].clientX;
        if (Math.abs(dy) > 65 && Math.abs(dy) > Math.abs(dx) * 1.5)
          go(station + (dy > 0 ? 1 : -1));
      }}
      className={`experience ${station === 0 && eventView > 0 ? "event-view" : ""}`}
      tabIndex={0}
      aria-label="Gallery 3D. Gunakan tombol panah untuk berpindah titik pandang."
      onKeyDown={(e) => {
        if (busy || e.target !== e.currentTarget) return;
        if (
          ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home"].includes(
            e.key,
          )
        ) {
          e.preventDefault();
          go(
            e.key === "Home"
              ? 0
              : station +
                  (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1),
          );
        }
      }}
    >
      {sceneEnabled && !failed && (
        <SceneBoundary onError={sceneError}>
          <Suspense fallback={null}>
            <Scene
              hour={hour}
              monasView={monasView}
              eventView={eventView}
              eventArea={eventArea}
              skyView={skyView}
              paused={busy}
              station={station}
              lobbyView={lobbyView}
              snapCount={snapCount}
              greetingOpen={greetingOpen}
              guestbookEntries={guestbookEntries}
              placements={placements}
              aiVisuals={aiVisuals}
              onGreetStaff={handleGreetStaff}
              onInspectBoard={handleInspectBoard}
              onOpenCatalog={openBookCatalog}
              onSelect={choose}
              onSelectVisual={chooseVisual}
              reduced={reduced}
              low={low}
              onReady={sceneReady}
            />
          </Suspense>
        </SceneBoundary>
      )}

      {/* Eye-blink transition overlay when jumping rooms via map */}
      <div
        className={`blink-overlay ${blinkPhase !== "idle" ? `blink-${blinkPhase}` : ""}`}
        aria-hidden="true"
      >
        <div className="eyelid eyelid-top" />
        <div className="eyelid eyelid-bottom" />
      </div>

      <header className="topbar">
        <button
          className="wordmark paper"
          onClick={() => go(0, station > 1)}
          aria-label="Ruang Karya, kembali ke halaman"
        >
          ruang<span>karya</span>
          <span className="brand-dot">26</span>
        </button>
        <nav className="paper navigation" aria-label="Navigasi utama">
          <button onClick={() => setMapOpen((v) => !v)}>
            Ruang <ChevronDown size={12} />
          </button>
          <button
            onClick={(e) => {
              rememberTrigger(e.currentTarget);
              galleryAudio.playClick();
              setAbout(true);
            }}
          >
            Tentang
          </button>
          <button onClick={() => goToRoom(6)}>Guestbook</button>
          <a
            href="https://rofiull.vercel.app/portfolio"
            target="_blank"
            rel="noreferrer"
          >
            Portofolio <ArrowUpRight size={13} />
          </a>
          <a href="mailto:muhammadrofi062@gmail.com">
            Kontak <ArrowUpRight size={13} />
          </a>
        </nav>
        <button
          className="paper mobile-catalog"
          onClick={(e) => openGeneralCatalog(e.currentTarget)}
          aria-label="Buka katalog"
        >
          <Grid2X2 size={18} />
        </button>
      </header>
      <div
        className="time-control paper"
        onWheel={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <Sun size={15} aria-hidden="true" />
        <input
          aria-label="Waktu lingkungan"
          type="range"
          min="6"
          max="22"
          step="0.25"
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          aria-valuetext={
            (hour < 11
              ? "Pagi"
              : hour < 16
                ? "Siang"
                : hour < 19
                  ? "Senja"
                  : "Malam") +
            " " +
            Math.floor(hour) +
            ":" +
            String(Math.round((hour % 1) * 60)).padStart(2, "0")
          }
        />
        <Moon size={13} aria-hidden="true" />
        <output>
          {hour < 11
            ? "Pagi"
            : hour < 16
              ? "Siang"
              : hour < 19
                ? "Senja"
                : "Malam"}
        </output>
      </div>

      <section
        className={`room-info paper ${station === 0 ? "entrance-info" : ""} ${inGuestbookRoom ? "guestbook-panel" : ""}`}
        aria-live="polite"
      >
        <div className="eyebrow">
          <span className="live-dot" />
          {station === 0
            ? "PAMERAN DIGITAL · 2026"
            : inGuestbookRoom
              ? "GUESTBOOK"
              : `${activeRoom.code} · ${activeRoom.short.toUpperCase()}`}
        </div>
        <h1>
          {station === 0 && eventView > 0 ? (
            "Malam di taman."
          ) : station === 0 ? (
            <>
              Ide menjadi
              <br />
              <em>ruang.</em>
            </>
          ) : (
            activeRoom.title
          )}
        </h1>
        <p>
          {station === 0 && eventView > 0
            ? hour >= 18
              ? "Kuliner hangat dan ide baru di sisi Monas."
              : "Ruko buka pukul 18.00. Bazar dan booth hadir saat senja."
            : activeRoom.subtitle}
        </p>
        {station === 0 && eventView > 0 && (
          <label className="event-area-select">
            Lihat area
            <select
              aria-label="Area acara"
              value={eventArea}
              onChange={(e) => setEventArea(e.target.value)}
            >
              <option value="overview">Semua area</option>
              <option value="food">Bazar makanan</option>
              <option value="tech">Booth teknologi</option>
              <option value="shops">Ruko makanan</option>
            </select>
          </label>
        )}
        {!inGuestbookRoom && (
          <div className="room-meta">{activeRoom.range}</div>
        )}

        {inLobby && (
          <div
            className="lobby-controls"
            role="group"
            aria-label="Kontrol orientasi lobby"
          >
            <div className="lobby-viewpoints">
              <button
                type="button"
                aria-pressed={lobbyView === "board"}
                onClick={() => {
                  galleryAudio.playClick();
                  setLobbyView((v) => (v === "board" ? "wide" : "board"));
                  setMapOpen(true);
                }}
              >
                <Compass size={12} /> Pandangan denah
              </button>
              <button
                type="button"
                aria-pressed={lobbyView === "desk"}
                onClick={() => {
                  galleryAudio.playClick();
                  setLobbyView((v) => (v === "desk" ? "wide" : "desk"));
                }}
              >
                <BookOpen size={12} /> Meja katalog
              </button>
            </div>
            <div className="lobby-actions">
              <button
                type="button"
                className="lobby-subaction"
                onClick={(e) => openBookCatalog(e.currentTarget)}
              >
                <BookOpen size={13} /> Buka buku katalog
              </button>
              <button
                type="button"
                className="lobby-subaction"
                onClick={() => {
                  galleryAudio.playGreet();
                  setGreetingOpen((v) => !v);
                }}
              >
                <MessageSquare size={13} /> Sapa petugas
              </button>
            </div>
          </div>
        )}

        {inAiRoom && (
          <div className="ai-room-actions">
            <button
              type="button"
              className="lobby-subaction"
              onClick={(e) => chooseVisual(aiVisuals[0], e.currentTarget)}
            >
              <Sparkles size={13} /> Periksa visual AI (01–08)
            </button>
          </div>
        )}

        {inGuestbookRoom ? (
          <form className="guestbook-form" onSubmit={handleGuestbookSubmit}>
            <label>
              <span>NAME</span>
              <input
                type="text"
                placeholder="Your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </label>
            <label>
              <span>EMAIL</span>
              <input
                type="email"
                placeholder="you@studio.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </label>
            <label>
              <span>MESSAGE</span>
              <textarea
                rows={3}
                placeholder="Which project, or what you have in mind"
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="guestbook-submit">
              SIGN THE GUESTBOOK
            </button>
            {guestSaved && (
              <div className="guestbook-saved" role="status">
                Terima kasih! Catatan Anda telah ditambahkan ke buku tamu.
              </div>
            )}
            <div className="guestbook-mailto">
              Or write to{" "}
              <a href="mailto:muhammadrofi062@gmail.com">
                muhammadrofi062@gmail.com
              </a>
            </div>
          </form>
        ) : (
          <button
            className="text-action"
            onClick={(e) => {
              if (station === 0) {
                ensureAudioOnEntry();
                go(1);
              } else if (inLobby) {
                go(2);
              } else if (isRoomOverview && room >= 2 && room <= 5) {
                go(station + 1);
              } else {
                openGeneralCatalog(e.currentTarget);
              }
            }}
          >
            {station === 0
              ? "Masuk gallery"
              : inLobby
                ? "Lanjut ke ruang 01"
                : isRoomOverview && room >= 2 && room <= 4
                  ? `Lihat karya di ${activeRoom.short.toLowerCase()}`
                  : isRoomOverview && room === 5
                    ? "Dekati rak visual AI"
                    : "Jelajahi katalog"}{" "}
            <ArrowRight size={16} />
          </button>
        )}
      </section>

      {station === 0 && (
        <div className="city-caption">
          <div className="view-shortcuts">
            <button
              className="monas-look"
              onClick={() => {
                setEventView(0);
                setMonasView((v) => v + 1);
              }}
            >
              Lihat Monas <RotateCcw size={13} />
            </button>
            <button
              className="monas-look"
              onClick={() => {
                setEventView(0);
                setSkyView((v) => ({ id: (v?.id ?? 0) + 1, hour }));
              }}
            >
              Lihat langit <Sun size={13} />
            </button>
          </div>
          <button
            className="night-event-link"
            onClick={() => {
              setHour(20);
              setEventArea(window.innerWidth < 600 ? "tech" : "overview");
              setEventView((v) => v + 1);
            }}
          >
            Acara malam <Moon size={13} />
          </button>
          <small className="event-hours">
            Bazar kuliner & teknologi · 18.00–22.00
          </small>
          <span>06°10′ S &nbsp; 106°49′ E</span>
          <span>TERINSPIRASI JAKARTA</span>
          <small>Lingkungan kota ilustratif</small>
        </div>
      )}

      {!ready && !failed && (
        <div className="loading paper" role="status">
          <LoaderCircle className="spin" size={16} />
          {slow
            ? "Scene masih dimuat. Katalog siap dibuka."
            : "Menyiapkan ruang pamer…"}
          <button onClick={(e) => openGeneralCatalog(e.currentTarget)}>
            Katalog <ArrowUpRight size={14} />
          </button>
        </div>
      )}

      {failed && (
        <div className="loading paper" role="status">
          Tampilan 3D tidak tersedia.
          <button onClick={(e) => openGeneralCatalog(e.currentTarget)}>
            Buka katalog
          </button>
          <button
            onClick={() => {
              setFailed(false);
              setReady(false);
            }}
          >
            Coba lagi
          </button>
        </div>
      )}

      {active >= 0 && (
        <button
          className="art-caption paper"
          onClick={(e) => choose(featured[active], e.currentTarget)}
        >
          <span className="art-number">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(featured.length).padStart(2, "0")}
          </span>
          <span>
            <strong>{shortTitle(featured[active])}</strong>
            <small>
              {featured[active].year} ·{" "}
              {status(featured[active]) || featured[active].categories[0]}
            </small>
          </span>
          <ArrowUpRight size={20} />
        </button>
      )}

      {onAiShelfStation && (
        <button
          className="art-caption paper"
          onClick={(e) => chooseVisual(aiVisuals[0], e.currentTarget)}
        >
          <span className="art-number">08 VISUAL / RAK 3–3–2</span>
          <span>
            <strong>AI Product Visuals</strong>
            <small>
              Karya berbantuan AI · Klik untuk melihat detail visual 01–08
            </small>
          </span>
          <ArrowUpRight size={20} />
        </button>
      )}

      <aside
        className={`floorplan paper ${mapOpen ? "expanded" : ""}`}
        aria-label="Denah gallery"
      >
        <div className="map-heading">
          <span>DENAH GALLERY</span>
          <button
            className="map-toggle"
            onClick={() => setMapOpen((v) => !v)}
            aria-label={mapOpen ? "Tutup denah" : "Buka denah"}
          >
            <Map size={18} />
          </button>
        </div>
        <div className="map-body">
          <svg
            viewBox="0 0 132 285"
            role="img"
            aria-label={`Denah, lokasi aktif ${activeRoom.short}`}
          >
            <path
              d="M25 14H107V252H88V272H44V252H25Z"
              fill="#ddd9cd"
              stroke="#9c9c8c"
              strokeWidth="1.5"
            />
            <path
              d="M25 51H57M75 51H107M25 91H57M75 91H107M25 131H57M75 131H107M25 171H57M75 171H107M25 211H57M75 211H107M25 250H57M75 250H107"
              stroke="#9c9c8c"
              strokeWidth="2"
            />
            {[...interiorRooms].reverse().map((r) => {
              const box = r.mapBox!;
              const isCurrent = room === r.index;
              return (
                <g
                  key={r.id}
                  onClick={() => goToRoom(r.index)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.width}
                    height={box.height}
                    fill={isCurrent ? "#a64d34" : "#efede5"}
                  />
                  <text
                    x={box.x + box.width / 2}
                    y={box.y + box.height / 2 + 4}
                    textAnchor="middle"
                    fill={isCurrent ? "#fff9e9" : "#656958"}
                    fontSize="10.5"
                  >
                    {r.code}
                  </text>
                </g>
              );
            })}
            <circle
              cx="66"
              cy={activeRoom.dotY}
              r="4"
              fill={room === 0 ? "#a64d34" : "#fff8e7"}
              stroke="#85442f"
              strokeWidth="2"
            />
            <path d="M66 280v-6m-3 3 3-3 3 3" fill="none" stroke="#737764" />
          </svg>
          <div className="room-links">
            {rooms.map((r) => (
              <button
                key={r.id}
                aria-current={room === r.index ? "location" : undefined}
                onClick={() => goToRoom(r.index)}
              >
                <span>{r.code || "—"}</span>
                {r.short}
                {room === r.index && <span className="current-dot" />}
              </button>
            ))}
          </div>
        </div>
        <button
          className="catalog-link"
          onClick={(e) => openGeneralCatalog(e.currentTarget)}
        >
          <Grid2X2 size={14} /> Katalog karya <ArrowUpRight size={13} />
        </button>
      </aside>

      <footer className="bottom-bar">
        <div className="bottom-left-controls">
          <button
            type="button"
            className={`paper sound-toggle ${soundOn ? "active" : ""}`}
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Matikan suara" : "Aktifkan suara"}
          >
            <span className="eq-bars" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>{soundOn ? "SOUND ON" : "SOUND OFF"}</span>
          </button>
          <button
            className="paper quality"
            onClick={() => {
              galleryAudio.playClick();
              setLow((v) => !v);
            }}
            title="Ubah kualitas render"
          >
            <SlidersHorizontal size={14} />
            <span>{low ? "KUALITAS RINGAN" : "KUALITAS TINGGI"}</span>
          </button>
        </div>
        <div className="journey paper">
          <button
            aria-label="Titik sebelumnya"
            disabled={station === 0}
            onClick={() => go(station - 1)}
          >
            <ArrowLeft size={17} />
          </button>
          <span>
            {station === 0
              ? "SCROLL UNTUK MASUK"
              : `${String(station).padStart(2, "0")} / ${String(totalInteriorStations).padStart(2, "0")} · JELAJAHI RUANG`}
          </span>
          <button
            aria-label="Titik berikutnya"
            disabled={station === stations.length - 1}
            onClick={() => go(station + 1)}
          >
            <ArrowRight size={17} />
          </button>
        </div>
        <span className="signature">
          Sebuah eksplorasi oleh{" "}
          <a
            href="https://rofiull.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            Rofi.
          </a>
        </span>
      </footer>

      {station > 0 && !inGuestbookRoom && (
        <span className="drag-hint">
          <Mouse size={13} /> Drag untuk melihat 360°
        </span>
      )}

      <dialog
        ref={catalogDialog}
        aria-label="Katalog karya"
        className="catalog-dialog"
        onCancel={(e) => {
          e.preventDefault();
          closeCatalog();
        }}
        onClose={() => {
          if (catalog) closeCatalog();
        }}
      >
        <button
          className="icon-button catalog-close"
          aria-label="Tutup katalog dan masuk 3D"
          onClick={closeCatalog}
        >
          <X />
        </button>
        <div className="dialog-header">
          <div>
            <span className="eyebrow">
              KATALOG RUANG KARYA · {projects.length} PROYEK &{" "}
              {aiVisuals.length} VISUAL AI
            </span>
            <h2>
              Karya & eksplorasi<span>.</span>
            </h2>
          </div>
        </div>

        {openedFromBook ? (
          <div className="book-welcome">
            <div className="book-welcome-copy">
              <span className="eyebrow">BUKU KATALOG RESEPSI</span>
              <p>
                Selamat datang di Ruang Karya. Buku katalog ini merangkum dua
                koleksi utama museum: proyek rekayasa perangkat lunak di Ruang
                01–03 serta eksplorasi visual produk berbantuan AI di Ruang 04.
              </p>
            </div>
            <div className="book-collection-cards">
              <button
                type="button"
                className={`collection-card ${collection === "software" ? "selected" : ""}`}
                onClick={() => {
                  galleryAudio.playBook();
                  setCollection("software");
                }}
              >
                <span className="eyebrow">KOLEKSI 01 · RUANG 01–03</span>
                <strong>Proyek Software ({projects.length})</strong>
                <small>
                  Aplikasi web, mobile, desain antarmuka, IoT, dan eksperimen AI
                </small>
              </button>
              <button
                type="button"
                className={`collection-card ${collection === "ai" ? "selected" : ""}`}
                onClick={() => {
                  galleryAudio.playBook();
                  setCollection("ai");
                }}
              >
                <span className="eyebrow">KOLEKSI 02 · RUANG 04</span>
                <strong>AI Product Visuals ({aiVisuals.length})</strong>
                <small>
                  Delapan visual produk komersial berbantuan generative AI
                </small>
              </button>
            </div>
          </div>
        ) : (
          <p className="catalog-intro">
            Dari ide kecil hingga sistem yang terus tumbuh. Pilih koleksi dan
            karya untuk mengenalnya lebih dekat.
          </p>
        )}

        <div
          className="collection-tabs"
          role="tablist"
          aria-label="Koleksi katalog museum"
        >
          <button
            type="button"
            role="tab"
            aria-selected={collection === "software"}
            className={`collection-tab ${collection === "software" ? "active" : ""}`}
            onClick={() => {
              galleryAudio.playBook();
              setCollection("software");
            }}
          >
            Proyek Software <span>{projects.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={collection === "ai"}
            className={`collection-tab ${collection === "ai" ? "active" : ""}`}
            onClick={() => {
              galleryAudio.playBook();
              setCollection("ai");
            }}
          >
            AI Product Visuals <span>{aiVisuals.length}</span>
          </button>
        </div>

        {collection === "software" ? (
          <>
            <div className="catalog-tools">
              <div className="filters">
                {[
                  "Semua",
                  "Website",
                  "Mobile",
                  "UI/UX Design",
                  "IoT",
                  "Machine Learning",
                ].map((c) => (
                  <button
                    key={c}
                    aria-pressed={category === c}
                    onClick={() => {
                      galleryAudio.playClick();
                      setCategory(c);
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                type="search"
                aria-label="Cari proyek"
                placeholder="Cari karya…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="project-grid">
              {visible.map((p, i) => (
                <button
                  className="project-card"
                  key={p.id}
                  onClick={(e) => choose(p, e.currentTarget)}
                >
                  <div className="project-image">
                    <img
                      src={p.cover}
                      alt={`Pratinjau ${p.title}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="project-row">
                    <h3>{shortTitle(p)}</h3>
                    <ArrowUpRight size={18} />
                  </div>
                  <p>
                    {p.year} · {status(p) || p.categories[0]}
                  </p>
                </button>
              ))}
            </div>
            {!visible.length && (
              <div className="empty">
                Tidak ada karya yang cocok.
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("Semua");
                  }}
                >
                  Reset pencarian <RotateCcw size={15} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="ai-catalog-section">
            <div className="ai-catalog-header">
              <p>
                Koleksi visual produk komersial pilihan yang dibuat dengan
                kecerdasan buatan generatif. Dipamerkan pada rak tiga tingkat
                (susunan 3–3–2) di Ruang 04.
              </p>
              <div className="ai-catalog-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setCatalog(false);
                    setOpenedFromBook(false);
                    goToRoom(5);
                  }}
                >
                  Kunjungi Ruang 04 <ArrowRight size={14} />
                </button>
                <a
                  className="primary"
                  href={aiCatalogUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Lihat katalog lengkap <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="project-grid ai-grid">
              {aiVisuals.map((v) => (
                <button
                  className="project-card ai-card"
                  key={v.id}
                  onClick={(e) => chooseVisual(v, e.currentTarget)}
                >
                  <div className="project-image ai-image">
                    <img
                      src={v.texture}
                      alt={v.alt}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />
                    <span>{String(v.order).padStart(2, "0")}</span>
                  </div>
                  <div className="project-row">
                    <h3>{v.title}</h3>
                    <ArrowUpRight size={18} />
                  </div>
                  <p>
                    {v.label} · Rak 0{v.shelf + 1}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="catalog-bottom">
          <div className="external-links">
            <button
              onClick={(e) => {
                rememberTrigger(e.currentTarget);
                setAbout(true);
              }}
            >
              Tentang gallery
            </button>
            <a href="mailto:muhammadrofi062@gmail.com">
              Kontak <ArrowUpRight size={13} />
            </a>
          </div>
          <span>MUHAMMAD ROFI'UL ARHAM</span>
          <button
            className="primary"
            onClick={() => {
              setCatalog(false);
              setOpenedFromBook(false);
              go(station === 0 ? 1 : station);
            }}
          >
            Masuk pengalaman 3D <ArrowRight size={16} />
          </button>
        </div>
      </dialog>

      <dialog
        ref={dialog}
        aria-label={
          selected ? `Detail proyek ${selected.title}` : "Detail proyek"
        }
        className="project-dialog"
        onCancel={(e) => {
          e.preventDefault();
          closeProject();
        }}
        onClose={() => {
          if (selected) closeProject();
        }}
      >
        {selected && (
          <>
            <button
              className="icon-button close-project"
              aria-label="Tutup detail proyek"
              onClick={closeProject}
            >
              <X />
            </button>
            <div className="detail-art">
              <img
                src={selected.images[imageIndex]}
                alt={`${selected.title}, gambar ${imageIndex + 1}`}
                onError={(e) => {
                  e.currentTarget.alt = "Gambar belum dapat dimuat";
                }}
              />
              {selected.images.length > 1 && (
                <div className="image-controls">
                  <button
                    aria-label="Gambar sebelumnya"
                    onClick={() => {
                      galleryAudio.playClick();
                      setImageIndex(
                        (imageIndex - 1 + selected.images.length) %
                          selected.images.length,
                      );
                    }}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <span>
                    {imageIndex + 1} / {selected.images.length}
                  </span>
                  <button
                    aria-label="Gambar berikutnya"
                    onClick={() => {
                      galleryAudio.playClick();
                      setImageIndex((imageIndex + 1) % selected.images.length);
                    }}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="detail-copy">
              <div className="eyebrow">
                {selected.year} / {selected.categories[0]}
              </div>
              <h2>{shortTitle(selected)}</h2>
              {status(selected) && (
                <p className="status-label">{status(selected)}</p>
              )}
              <p>{selected.description}</p>
              {selected.title === "Veyra Vision" && (
                <p className="asset-note">
                  Mockup presentasi dengan data demo ilustratif; sebagian visual
                  disunting dengan AI. Gambar manajemen kamera berasal dari
                  lingkungan pengujian.
                </p>
              )}
              <dl>
                <div>
                  <dt>Peran / layanan</dt>
                  <dd>{selected.role || "Lihat rincian pada case study"}</dd>
                </div>
                <div>
                  <dt>Teknologi</dt>
                  <dd>{selected.tech.join(" · ")}</dd>
                </div>
              </dl>
              <a
                className="primary"
                href={selected.caseStudy}
                target="_blank"
                rel="noreferrer"
              >
                Baca case study <ArrowUpRight size={17} />
              </a>
              <div className="external-links">
                {selected.links
                  .filter((l) => /^https?:/.test(l.url))
                  .map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {l.label}
                      <ArrowUpRight size={13} />
                    </a>
                  ))}
              </div>
            </div>
          </>
        )}
      </dialog>

      <dialog
        ref={visualDialog}
        aria-label={
          selectedVisual
            ? `Detail visual ${selectedVisual.title}`
            : "Detail visual AI"
        }
        className="project-dialog ai-visual-dialog"
        onCancel={(e) => {
          e.preventDefault();
          closeVisual();
        }}
        onClose={() => {
          if (selectedVisualIndex !== null) closeVisual();
        }}
        onKeyDown={(e) => {
          if (selectedVisualIndex === null) return;
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            galleryAudio.playProjectScroll();
            setSelectedVisualIndex(
              (selectedVisualIndex - 1 + aiVisuals.length) % aiVisuals.length,
            );
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            galleryAudio.playProjectScroll();
            setSelectedVisualIndex(
              (selectedVisualIndex + 1) % aiVisuals.length,
            );
          }
        }}
      >
        {selectedVisual && selectedVisualIndex !== null && (
          <>
            <button
              className="icon-button close-project"
              aria-label="Tutup detail visual"
              onClick={closeVisual}
            >
              <X />
            </button>
            <div className="detail-art">
              <img
                src={selectedVisual.image}
                alt={selectedVisual.alt}
                onError={(e) => {
                  e.currentTarget.alt = "Visual belum dapat dimuat";
                }}
              />
              <div className="image-controls">
                <button
                  aria-label="Visual sebelumnya"
                  onClick={() => {
                    galleryAudio.playProjectScroll();
                    setSelectedVisualIndex(
                      (selectedVisualIndex - 1 + aiVisuals.length) %
                        aiVisuals.length,
                    );
                  }}
                >
                  <ArrowLeft size={16} />
                </button>
                <span>
                  {String(selectedVisual.order).padStart(2, "0")} /{" "}
                  {String(aiVisuals.length).padStart(2, "0")}
                </span>
                <button
                  aria-label="Visual berikutnya"
                  onClick={() => {
                    galleryAudio.playProjectScroll();
                    setSelectedVisualIndex(
                      (selectedVisualIndex + 1) % aiVisuals.length,
                    );
                  }}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <div className="detail-copy">
              <div className="eyebrow">
                RUANG 04 / {selectedVisual.label.toUpperCase()}
              </div>
              <h2>{selectedVisual.title}</h2>
              <p className="status-label">{selectedVisual.label}</p>
              <p>{selectedVisual.caption}</p>
              <a
                className="primary"
                href={selectedVisual.catalogUrl}
                target="_blank"
                rel="noreferrer"
              >
                Lihat katalog lengkap <ArrowUpRight size={17} />
              </a>
            </div>
          </>
        )}
      </dialog>

      <dialog
        ref={aboutDialog}
        aria-label="Tentang gallery"
        className="about-dialog"
        onCancel={(e) => {
          e.preventDefault();
          setAbout(false);
          restoreFocus();
        }}
        onClose={() => {
          if (about) {
            setAbout(false);
            restoreFocus();
          }
        }}
      >
        <button
          className="icon-button"
          aria-label="Tutup tentang"
          onClick={() => {
            setAbout(false);
            restoreFocus();
          }}
        >
          <X />
        </button>
        <span className="eyebrow">TENTANG RUANG INI</span>
        <h2>
          Setiap karya
          <br />
          punya <em>cerita.</em>
        </h2>
        <p>
          Saya Muhammad Rofi'ul Arham, Software Developer yang membangun
          pengalaman web dan mobile. Ruang ini adalah cara lain untuk berbagi
          perjalanan saya: ide, proses, dan proyek yang terus berkembang.
        </p>
        <p>
          Gallery digital ini berada dalam lingkungan kota ilustratif yang
          terinspirasi Jakarta, dilengkapi lobby penyambutan, tiga ruang karya
          software, ruang khusus AI Product Visuals, serta ruang buku tamu
          penutup.
        </p>
        <a
          className="primary"
          href="https://rofiull.vercel.app/"
          target="_blank"
          rel="noreferrer"
        >
          Kenali saya lebih dekat <ArrowUpRight size={16} />
        </a>
        <div className="external-links">
          <a
            href="https://github.com/muhammadrofi12"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={13} />
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-rofi-ul-arham/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowUpRight size={13} />
          </a>
        </div>
      </dialog>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
