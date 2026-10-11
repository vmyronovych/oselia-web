import { animate, createTimeline, type Timeline, type JSAnimation } from 'animejs';
import { shutterSteps } from '../data/shutter-guide';
import type { Lang } from '../i18n/ui';

export function initializeShutterGuides() {
  document.querySelectorAll<HTMLElement>('.shutter-guide').forEach((root) => {
    const lang = root.dataset.lang as Lang;
    const uk = lang === 'uk';
    const steps = shutterSteps[lang];
    const get = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
    const stage = get('[data-demo]');
    const scene = get('[data-scene]');
    const firstScene = document.createElement('template');
    firstScene.innerHTML = scene.innerHTML;
    const cursor = get('[data-cursor]');
    const ripple = get('[data-ripple]');
    const play = get<HTMLButtonElement>('[data-play]');
    const next = get<HTMLButtonElement>('[data-next]');
    const previous = get<HTMLButtonElement>('[data-previous]');
    const picker = get<HTMLSelectElement>('[data-step-select]');
    const progress = get('[data-progress]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let playing = false;
    let timeline: Timeline | undefined;
    let movement: JSAnimation | undefined;
    let transition: JSAnimation | undefined;
    let frameRequest = 0;

    function syncPlayButton() {
      play.textContent = playing ? (uk ? 'Ⅱ Пауза' : 'Ⅱ Pause') : (uk ? '▶ Автопоказ' : '▶ Auto play');
      play.setAttribute('aria-pressed', String(playing));
    }

    function pause() {
      playing = false;
      timeline?.pause();
      movement?.pause();
      syncPlayButton();
    }

    function ensureTargetVisible() {
      const target = scene.querySelector<HTMLElement>(`[data-target="${steps[index].target}"]`);
      if (!target) return;
      const outer = scene.getBoundingClientRect();
      const inner = target.getBoundingClientRect();
      if (inner.bottom > outer.bottom - 32 || inner.top < outer.top + 16) {
        scene.scrollTop += inner.top - outer.top - Math.max(30, (outer.height - inner.height) / 2);
      }
      return target;
    }

    function setRoomOverride() {
      const toggle = scene.querySelector<HTMLInputElement>('[data-area-switch]');
      const area = scene.querySelector<HTMLSelectElement>('[data-area-select]');
      const save = scene.querySelector<HTMLButtonElement>('[data-area-save]');
      if (!toggle || !area || !save) return;
      area.disabled = toggle.checked;
      if (toggle.checked) area.value = 'board';
      save.disabled = area.value !== 'room';
    }

    function buildPlayback() {
      timeline?.cancel();
      movement?.cancel();
      const step = steps[index];
      const target = ensureTargetVisible();
      const duration = step.duration;
      timeline = createTimeline({ autoplay: false, onComplete: () => {
        if (!playing) return;
        if (index < steps.length - 1) show(index + 1);
        else { timeline = undefined; pause(); }
      } });
      timeline.add(progress, { width: [`${index / steps.length * 100}%`, `${(index + 1) / steps.length * 100}%`], duration, ease: 'linear' }, 0);

      if (!reducedMotion.matches && target) {
        const r = target.getBoundingClientRect();
        const s = stage.getBoundingClientRect();
        const x = r.left - s.left + r.width * .7;
        const y = r.top - s.top + r.height * .65;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        timeline.add(cursor, { left: [Math.max(15,x-100),x], top: [Math.min(s.height-55,y+65),y], opacity: [0,1], duration: 900, ease: 'inOutQuad' }, 700);
        timeline.add(ripple, { opacity: [0,.9,0], scale: [.5,1.8], duration: 650, ease: 'outQuad' }, duration - 1000);
        timeline.add(cursor, { opacity: 0, duration: 200 }, duration - 250);
      }

      if (step.scene === 'create' && !reducedMotion.matches) {
        const input = scene.querySelector<HTMLInputElement>('.ha-field input')!;
        const value = input.value;
        const typing = { characters: 0 };
        timeline.add(typing, { characters: [0,value.length], duration: 1800, ease: 'linear', onUpdate: () => { input.value = value.slice(0,Math.round(typing.characters)); } }, 1800);
      }
      if (step.scene === 'test') {
        const slats = get<SVGElement>('[data-slats]');
        const status = get('[data-cover-status]');
        timeline.call(() => { status.textContent = uk ? 'Відкривання' : 'Opening'; }, 1000);
        timeline.add(slats, { height: [126,35], duration: reducedMotion.matches ? 1 : 1900, ease: 'linear' }, 1000);
        timeline.call(() => { status.textContent = uk ? 'Зупинено' : 'Stopped'; }, 2900);
        timeline.call(() => { status.textContent = uk ? 'Закривання' : 'Closing'; }, 4400);
        timeline.add(slats, { height: [35,174], duration: reducedMotion.matches ? 1 : 2400, ease: 'linear' }, 4400);
        timeline.call(() => { status.textContent = uk ? 'Зупинено' : 'Stopped'; }, 6800);
      }
      if (step.scene === 'room') {
        timeline.call(() => {
          get<HTMLInputElement>('[data-area-switch]').checked = false;
          setRoomOverride();
        }, 2300);
        timeline.call(() => {
          get<HTMLSelectElement>('[data-area-select]').value = 'room';
          setRoomOverride();
        }, 4200);
      }
      if (step.scene === 'listen') timeline.call(() => { get<HTMLInputElement>('[data-listen]').checked = true; }, 2300);
      timeline.play();
    }

    function show(newIndex: number) {
      timeline?.cancel(); timeline = undefined;
      movement?.cancel(); movement = undefined;
      transition?.cancel();
      cancelAnimationFrame(frameRequest);
      index = Math.max(0,Math.min(steps.length-1,newIndex));
      const step = steps[index];
      const template = index === 0 ? firstScene : get<HTMLTemplateElement>(`[data-template="${step.scene}"]`);
      scene.replaceChildren(template.content.cloneNode(true));
      if (['options', 'create', 'timing'].includes(step.scene)) {
        const underlay = document.createElement('div');
        underlay.className = 'ha-modal-underlay';
        underlay.inert = true;
        underlay.setAttribute('aria-hidden', 'true');
        underlay.append(firstScene.content.cloneNode(true));
        underlay.querySelectorAll('.guide-target').forEach(element => element.classList.remove('guide-target'));
        scene.prepend(underlay);
      }
      scene.scrollTop = 0;
      cursor.style.opacity = '0'; ripple.style.opacity = '0';
      get('[data-step-title]').textContent = step.title;
      get('[data-step-body]').textContent = step.body;
      get('[data-step-hint]').textContent = step.hint;
      get('[data-step-number]').textContent = `${String(index+1).padStart(2,'0')} / ${steps.length}`;
      get('[data-path]').textContent = step.path;
      picker.value = String(index);
      previous.disabled = index === 0;
      next.textContent = index === steps.length-1 ? (uk?'Спочатку ↺':'Start again ↺') : (uk?'Далі →':'Next →');
      progress.style.width = `${(index+1)/steps.length*100}%`;
      const panel = ['listen','learned','binding','second'].includes(step.scene);
      const dashboard = step.scene === 'dashboard';
      get('[data-ha-title]').textContent = panel ? 'OSELIA Config' : dashboard ? 'OSELIA' : 'Settings';
      get('[data-ha-tabs]').hidden = panel || dashboard || step.scene === 'test';
      get('[data-ha-tabs]').querySelectorAll('span').forEach(item => item.classList.toggle('active', item.textContent === (step.scene === 'room' ? 'Entities' : 'Integrations')));
      root.querySelectorAll<HTMLElement>('[data-sidebar]').forEach(item => item.classList.toggle('selected',item.dataset.sidebar === (panel?'OSELIA Config':dashboard?'OSELIA':'Settings')));
      scene.querySelector(`[data-target="${step.target}"]`)?.classList.add('guide-target');
      if (!reducedMotion.matches) transition = animate(scene, { opacity: [0,1], duration: 220, ease: 'outQuad' });
      else scene.style.opacity = '1';
      frameRequest = requestAnimationFrame(() => {
        ensureTargetVisible();
        if (playing) buildPlayback();
      });
      syncPlayButton();
    }

    function goTo(newIndex: number) { pause(); show(newIndex); }
    previous.addEventListener('click', () => goTo(index-1));
    next.addEventListener('click', () => goTo(index === steps.length-1 ? 0 : index+1));
    picker.addEventListener('change', () => goTo(Number(picker.value)));
    play.addEventListener('click', () => {
      if (playing) { pause(); return; }
      playing = true; syncPlayButton();
      if (timeline) timeline.resume();
      else buildPlayback();
    });

    scene.addEventListener('click', event => {
      const target = event.target as Element;
      const advance = target.closest<HTMLButtonElement>('[data-advance]');
      if (advance && !advance.disabled) { goTo(index+1); return; }
      if (target.closest('[data-area-save]')) {
        if (!get<HTMLButtonElement>('[data-area-save]').disabled) goTo(index+1);
        return;
      }
      const motion = target.closest<HTMLElement>('[data-motion]');
      if (motion) {
        pause(); timeline?.cancel(); timeline = undefined;
        movement?.cancel();
        const action = motion.dataset.motion;
        const status = get('[data-cover-status]');
        if (action === 'stop') { status.textContent = uk?'Зупинено':'Stopped'; return; }
        status.textContent = action === 'open' ? (uk?'Відкривання':'Opening') : (uk?'Закривання':'Closing');
        movement = animate(get('[data-slats]'), { height: action === 'open' ? 8 : 174, duration: reducedMotion.matches ? 0 : 2500, ease: 'linear', onComplete: () => { status.textContent = action === 'open' ? (uk?'Відкрито':'Open') : (uk?'Закрито':'Closed'); } });
      }
      const resident = target.closest<HTMLElement>('[data-resident]');
      if (resident) {
        pause();
        if (resident.dataset.resident !== 'stop') get<HTMLInputElement>('[data-position]').value = resident.dataset.resident!;
        updateResidentStatus();
      }
    });
    function updateResidentStatus() {
      get('[data-resident-status]').textContent = `${get<HTMLInputElement>('[data-position]').value}% ${uk?'відкрито':'open'}`;
    }
    scene.addEventListener('change', event => {
      const target = event.target as HTMLElement;
      if (target.matches('[data-listen]') && (target as HTMLInputElement).checked) goTo(index+1);
      if (target.matches('[data-area-switch], [data-area-select]')) {
        pause(); timeline?.cancel(); timeline = undefined;
        setRoomOverride();
      }
    });
    scene.addEventListener('input', event => {
      if ((event.target as Element).matches('[data-position]')) { pause(); updateResidentStatus(); }
    });
    // Do not advance while the reader is in another tab or while layout changes.
    document.addEventListener('visibilitychange', () => { if(document.hidden) pause(); });
    window.addEventListener('resize', () => { if(playing) { pause(); timeline?.cancel(); timeline=undefined; cursor.style.opacity='0'; } });
    reducedMotion.addEventListener('change', () => { pause(); show(index); });
    show(0);
  });
}
