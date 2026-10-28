document.addEventListener("DOMContentLoaded", () => {
  const story = document.querySelector("[data-org-ai-story]");

  if (story) {
    const storyScreens = [...story.querySelectorAll("[data-story-screen]")];
    const storySteps = [...story.querySelectorAll("[data-story-step]")];
    const storyBack = story.querySelector("[data-story-prev]");
    const storyNext = story.querySelector("[data-story-next]");
    const nextLabels = [
      "Analyze performance",
      "Explore diagnosis",
      "View recommendation",
      "Review intervention",
      "Launch and track",
      "Restart scenario",
    ];
    let currentStoryScreen = 0;

    const showStoryScreen = (index, focusHeading = true) => {
      currentStoryScreen = Math.max(0, Math.min(index, storyScreens.length - 1));

      storyScreens.forEach((screen, screenIndex) => {
        const isActive = screenIndex === currentStoryScreen;
        screen.hidden = !isActive;
        screen.classList.toggle("is-active", isActive);
      });

      storySteps.forEach((step, stepIndex) => {
        const isActive = stepIndex === currentStoryScreen;
        step.classList.toggle("is-active", isActive);
        step.classList.toggle("is-complete", stepIndex < currentStoryScreen);
        step.setAttribute("aria-selected", String(isActive));
      });

      storyBack.disabled = currentStoryScreen === 0;
      storyNext.childNodes[0].textContent = `${nextLabels[currentStoryScreen]} `;

      if (focusHeading) {
        const heading = storyScreens[currentStoryScreen].querySelector("h3");
        if (heading) {
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
      }
    };

    story.addEventListener("click", (event) => {
      const previous = event.target.closest("[data-story-prev]");
      const next = event.target.closest("[data-story-next]");
      const step = event.target.closest("[data-story-step]");

      if (previous) {
        showStoryScreen(currentStoryScreen - 1);
        return;
      }

      if (next) {
        showStoryScreen(currentStoryScreen === storyScreens.length - 1 ? 0 : currentStoryScreen + 1);
        return;
      }

      if (step) {
        showStoryScreen(Number(step.dataset.storyStep));
      }
    });

    showStoryScreen(0, false);
  }

  const sourcePrototype = document.querySelector("[data-org-ai-prototype]");
  const perspectiveTwo = document.querySelector("[data-org-ai-perspective-two]");

  const configurePerspectiveTwo = (prototype) => {
    prototype.dataset.orgAiVariant = "perspective-two";
    const screens = [...prototype.querySelectorAll("[data-ai-screen]")];

    const analysisScreen = screens[1];
    analysisScreen.querySelector(".org-ai-status-label").textContent = "Deeper investigation";
    analysisScreen.querySelector("h3").textContent = "Investigating the Sales completion gap";
    analysisScreen.querySelector(".org-ai-centered-state > p").textContent =
      "Connecting learner activity, engagement, playlist progress, and content drop-off signals.";
    const analysisSteps = analysisScreen.querySelectorAll(".org-ai-analysis-list li");
    analysisSteps[0].lastChild.textContent = "Using the existing Sales-to-organization comparison";
    analysisSteps[1].lastChild.textContent = "Finding common learner drop-off points";
    analysisSteps[2].lastChild.textContent = "Connecting engagement, playlist, and completion signals";
    analysisSteps[3].lastChild.textContent = "Preparing evidence-backed interventions";

    screens[2].innerHTML = `
      <div class="org-ai-result-heading">
        <h3>Three signals may be contributing to lower completion in Sales.</h3>
        <p class="org-ai2-method-summary">AI compared Sales with organization-wide completion, activity, learner-return and playlist-duration patterns. These findings show correlation, not confirmed causation.</p>
      </div>
      <div class="org-ai2-diagnosis-meta">
        <div><span>Reporting period</span><strong>Last 30 days</strong></div>
        <div><span>Data last updated</span><strong>Oct 27, 9:00 AM PT</strong></div>
        <div class="org-ai2-confidence-meta">
          <span>Overall confidence</span>
          <strong>
            Moderate
            <button type="button" aria-label="What moderate confidence means" data-ai2-tooltip="Multiple signals align, but the available data does not establish causation.">i</button>
          </strong>
        </div>
      </div>
      <div class="org-ai2-cause-grid">
        <article>
          <span>Signal 1</span>
          <strong>Learners are dropping off at Module 3</strong>
          <p>39% of incomplete learners have not progressed beyond Module 3 in the past 14 days.</p>
          <button type="button" data-ai2-cause-toggle>Explore Module 3</button>
          <small data-ai2-cause-detail hidden><strong>Supporting data:</strong> Module 3 has the lowest seven-day return rate, and 57 of 146 at-risk learners have not progressed beyond it in 14 days. Source: playlist progress and learner activity.</small>
        </article>
        <article>
          <span>Signal 2</span>
          <strong>Engagement is declining</strong>
          <p>Weekly learner activity declined by 14 percentage points over the past three weeks.</p>
          <button type="button" data-ai2-cause-toggle>View engagement trend</button>
          <small data-ai2-cause-detail hidden><strong>Supporting data:</strong> Weekly engagement fell from 45% to 31%, while the organization average remained at 48%. Source: weekly learner activity.</small>
        </article>
        <article>
          <span>Signal 3</span>
          <strong>The playlist requires more time</strong>
          <p>The assigned playlist is 2.4 hours longer than comparable foundational playlists and may be increasing the effort required to complete it.</p>
          <button type="button" data-ai2-cause-toggle>Compare playlists</button>
          <small data-ai2-cause-detail hidden><strong>Supporting data:</strong> The Sales pathway requires 8.6 hours versus a 6.2-hour average across four comparable programs. Source: playlist duration and completion data.</small>
        </article>
      </div>
      <button class="org-ai-primary-button org-ai2-primary-action" type="button" data-ai-next>Review recommended interventions</button>
    `;

    screens[3].innerHTML = `
      <div class="org-ai-result-heading">
        <h3>Select one intervention for Maya to review and customize.</h3>
        <p>AI recommends an option, but nothing is selected until Maya chooses it.</p>
      </div>
      <div class="org-ai2-option-grid" role="radiogroup" aria-label="Intervention options">
        <button class="is-recommended" type="button" role="radio" data-ai2-option aria-checked="false">
          <span class="org-ai2-option-label">AI recommendation — review before continuing</span><span class="org-ai2-option-radio" aria-hidden="true"></span>
          <strong>Create a targeted campaign</strong>
          <p>Combine supporting content, reminders, and a 30-day completion goal.</p>
        </button>
        <button type="button" role="radio" data-ai2-option aria-checked="false">
          <span class="org-ai2-option-label">Option 1</span><span class="org-ai2-option-radio" aria-hidden="true"></span>
          <strong>Support learners at Module 3</strong>
          <p>Assign shorter supporting content before learners continue.</p>
        </button>
        <button type="button" role="radio" data-ai2-option aria-checked="false">
          <span class="org-ai2-option-label">Option 2</span><span class="org-ai2-option-radio" aria-hidden="true"></span>
          <strong>Re-engage inactive learners</strong>
          <p>Send reminders to learners inactive for 14 or more days.</p>
        </button>
        <button type="button" role="radio" data-ai2-option aria-checked="false">
          <span class="org-ai2-option-label">Option 3</span><span class="org-ai2-option-radio" aria-hidden="true"></span>
          <strong>Simplify the assigned playlist</strong>
          <p>Replace content that increases learning time without improving outcomes.</p>
        </button>
      </div>
      <div class="org-ai2-recommendation-note">
        <svg class="org-ai-copilot-agent org-ai2-recommendation-agent" viewBox="0 0 96 96" aria-hidden="true">
          <rect class="org-ai-copilot-ear" x="7" y="38" width="15" height="25" rx="7"></rect>
          <rect class="org-ai-copilot-ear" x="74" y="38" width="15" height="25" rx="7"></rect>
          <path class="org-ai-copilot-shell" d="M18 43c0-20 12-31 30-31s30 11 30 31v17c0 16-12 25-30 25S18 76 18 60V43Z"></path>
          <rect class="org-ai-copilot-face" x="23" y="31" width="50" height="38" rx="17"></rect>
          <path class="org-ai-copilot-goggles" d="M27 45c3-8 15-9 20-1m2 0c5-8 17-7 20 1"></path>
          <ellipse class="org-ai-copilot-eye org-ai-copilot-eye-left" cx="38" cy="49" rx="4" ry="5"></ellipse>
          <ellipse class="org-ai-copilot-eye org-ai-copilot-eye-right" cx="58" cy="49" rx="4" ry="5"></ellipse>
          <path class="org-ai-copilot-mouth" d="M39 61c5 3 13 3 18 0"></path>
          <path class="org-ai-copilot-scan" d="M28 56h40"></path>
        </svg>
        <p>
          <strong>Recommended: Create a targeted support campaign.</strong>
          <span>The campaign addresses the two strongest signals first: Module 3 drop-off and declining engagement. Playlist simplification requires content-owner review and can be considered separately.</span>
        </p>
      </div>
      <button class="org-ai-primary-button org-ai2-primary-action" type="button" data-ai2-customize data-ai-next disabled>Select an intervention</button>
    `;

    screens[4].innerHTML = `
      <div class="org-ai-result-heading">
        <h3>AI prepared the intervention, but Maya remains in control.</h3>
        <p>Edit any field, preview the complete campaign, and confirm before anything is launched.</p>
      </div>
      <div class="org-ai2-review-grid">
        <label class="org-ai2-review-wide">
          <span class="org-ai2-field-label">Campaign name</span>
          <span class="org-ai2-field-control">
            <input type="text" value="Sales AI Foundations Boost" data-ai2-review-field="campaign" data-ai2-default="Sales AI Foundations Boost">
            <span class="org-ai2-field-chevron" aria-hidden="true">&rsaquo;</span>
          </span>
        </label>
        <label>
          <span class="org-ai2-field-label">Audience</span>
          <span class="org-ai2-field-control">
            <input type="text" value="146 at-risk Sales learners" data-ai2-review-field="audience" data-ai2-default="146 at-risk Sales learners">
            <span class="org-ai2-field-chevron" aria-hidden="true">&rsaquo;</span>
          </span>
        </label>
        <label>
          <span class="org-ai2-field-label">Content</span>
          <span class="org-ai2-field-control">
            <input type="text" value="AI Foundations Boost with Module 3 support" data-ai2-review-field="content" data-ai2-default="AI Foundations Boost with Module 3 support">
            <span class="org-ai2-field-chevron" aria-hidden="true">&rsaquo;</span>
          </span>
        </label>
        <label>
          <span class="org-ai2-field-label">Communication</span>
          <span class="org-ai2-field-control is-multiline">
            <textarea rows="2" data-ai2-review-field="communication" data-ai2-default="Initial message and weekly reminder">Initial message and weekly reminder</textarea>
            <span class="org-ai2-field-chevron" aria-hidden="true">&rsaquo;</span>
          </span>
        </label>
        <label>
          <span class="org-ai2-field-label">Duration</span>
          <span class="org-ai2-field-control">
            <select data-ai2-review-field="duration" data-ai2-default="30 days"><option>30 days</option><option>45 days</option><option>60 days</option></select>
            <span class="org-ai2-field-chevron" aria-hidden="true">&rsaquo;</span>
          </span>
        </label>
        <label>
          <span class="org-ai2-field-label">Goal</span>
          <span class="org-ai2-field-control">
            <input type="text" value="Increase completion from 43% to 52%" data-ai2-review-field="goal" data-ai2-default="Increase completion from 43% to 52%">
            <span class="org-ai2-field-chevron" aria-hidden="true">&rsaquo;</span>
          </span>
        </label>
        <label>
          <span class="org-ai2-field-label">Owner</span>
          <span class="org-ai2-field-control">
            <input type="text" value="Sales learning owner" data-ai2-review-field="owner" data-ai2-default="Sales learning owner">
            <span class="org-ai2-field-chevron" aria-hidden="true">&rsaquo;</span>
          </span>
        </label>
      </div>
      <div class="org-ai2-campaign-preview" data-ai2-campaign-preview hidden>
        <div><span>Campaign name</span><strong data-ai2-preview-value="campaign">Sales AI Foundations Boost</strong><small>Maya can rename the campaign before launch</small></div>
        <div><span>Learners included</span><strong data-ai2-preview-value="audience">146 at-risk Sales learners</strong><small>91 account executives · 34 managers · 21 operations specialists</small></div>
        <div><span>Content assigned</span><strong data-ai2-preview-value="content">AI Foundations Boost with Module 3 support</strong><small>Foundational content with prerequisite support</small></div>
        <div><span>Learner message</span><strong data-ai2-preview-value="communication">Initial message and weekly reminder</strong><small>Your support pathway is ready. Complete it within the next 30 days.</small></div>
        <div><span>Reminder schedule</span><strong data-ai2-preview-value="duration">30 days</strong><small>Initial notification, then one reminder each week</small></div>
        <div><span>Owner update</span><strong data-ai2-preview-value="owner">Sales learning owner</strong><small>Receives a weekly progress summary and at-risk learner changes</small></div>
      </div>
      <div class="org-ai-approval-note">
        <svg class="org-ai-copilot-agent org-ai2-approval-agent" viewBox="0 0 96 96" aria-hidden="true">
          <rect class="org-ai-copilot-ear" x="7" y="38" width="15" height="25" rx="7"></rect>
          <rect class="org-ai-copilot-ear" x="74" y="38" width="15" height="25" rx="7"></rect>
          <path class="org-ai-copilot-shell" d="M18 43c0-20 12-31 30-31s30 11 30 31v17c0 16-12 25-30 25S18 76 18 60V43Z"></path>
          <rect class="org-ai-copilot-face" x="23" y="31" width="50" height="38" rx="17"></rect>
          <path class="org-ai-copilot-goggles" d="M27 45c3-8 15-9 20-1m2 0c5-8 17-7 20 1"></path>
          <ellipse class="org-ai-copilot-eye org-ai-copilot-eye-left" cx="38" cy="49" rx="4" ry="5"></ellipse>
          <ellipse class="org-ai-copilot-eye org-ai-copilot-eye-right" cx="58" cy="49" rx="4" ry="5"></ellipse>
          <path class="org-ai-copilot-mouth" d="M39 61c5 3 13 3 18 0"></path>
          <path class="org-ai-copilot-scan" d="M28 56h40"></path>
        </svg>
        <p>Nothing is assigned or communicated until Maya approves the intervention.</p>
      </div>
      <p class="org-ai2-inline-answer" data-ai2-review-feedback hidden></p>
      <div class="org-ai-action-row">
        <button class="org-ai-primary-button" type="button" data-ai2-request-launch>Approve and launch</button>
        <button class="org-ai-secondary-button" type="button" data-ai2-save-draft>Save as draft</button>
      </div>
      <div class="org-ai2-launch-confirmation" data-ai2-launch-confirmation hidden>
        <div>
          <strong tabindex="-1">Launch this campaign for 146 learners?</strong>
          <p>Messages will be scheduled immediately and AI monitoring will begin.</p>
        </div>
        <button class="org-ai-primary-button" type="button" data-ai-next>Confirm launch</button>
        <button class="org-ai-secondary-button" type="button" data-ai2-cancel-launch>Cancel</button>
      </div>
    `;

    screens[5].innerHTML = `
      <div data-ai2-launch-receipt>
        <div class="org-ai-success-banner">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>Campaign launched successfully</strong>
            <p><span data-ai2-launch-campaign-name>Sales AI Foundations Boost</span> launched for 146 learners. Messages were scheduled and monitoring was enabled.</p>
          </div>
        </div>
        <div class="org-ai-result-heading">
          <div class="org-ai2-live-heading-row">
            <h3>The intervention is live.</h3>
            <div class="org-ai2-management-dropdown">
              <button type="button" data-ai2-management-toggle aria-expanded="false">
                <b>Edit</b>
                <svg class="org-ai2-management-chevron" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="m5 7.5 5 5 5-5"></path>
                </svg>
              </button>
              <div class="org-ai2-management-menu" data-ai2-management-menu role="menu" hidden>
                <button type="button" role="menuitem" data-ai2-management-action data-ai2-answer="Pause stops future learner reminders while preserving progress and campaign data. Confirmation is required before the campaign is paused.">Pause campaign</button>
                <button type="button" role="menuitem" data-ai2-management-action data-ai2-answer="Future reminder timing and message copy can be edited without changing messages that have already been sent.">Edit future reminders</button>
                <button type="button" role="menuitem" data-ai2-management-action data-ai2-answer="Ending the campaign stops future reminders and AI monitoring. Historical results remain available, and confirmation is required.">End campaign</button>
                <button type="button" role="menuitem" data-ai2-management-action data-ai2-answer="Audit history records Maya's approval, the launch configuration, scheduled messages, and every change made after launch.">View audit history</button>
              </div>
            </div>
          </div>
          <p>Maya can verify what was executed while AI collects enough activity to evaluate the outcome.</p>
          <p class="org-ai2-management-feedback" data-ai2-management-feedback hidden></p>
        </div>
        <div class="org-ai-execution-receipt">
          <div><span aria-hidden="true">✓</span><p><strong>Audience assigned</strong>146 at-risk Sales learners</p></div>
          <div><span aria-hidden="true">✓</span><p><strong>Learning pathway</strong>AI Foundations Boost with Module 3 support</p></div>
          <div><span aria-hidden="true">✓</span><p><strong>Messages scheduled</strong>Weekly learner reminders</p></div>
          <div><span aria-hidden="true">✓</span><p><strong>Monitoring enabled</strong>Completion, engagement, and continuation</p></div>
        </div>
        <div class="org-ai-next-check org-ai2-first-check-card">
          <div>
            <span>First AI check-in</span>
            <strong>In 8 days</strong>
          </div>
          <p>AI will wait for enough learner activity before comparing completion, engagement, and Module 3 continuation.</p>
        </div>
        <div class="org-ai-action-row">
          <button class="org-ai-secondary-button" type="button" data-ai-restart>Return to updated homepage</button>
        </div>
      </div>

      <div data-ai2-first-check-in hidden>
        <div class="org-ai-result-heading">
          <span class="org-ai-status-pill">8 days later · First AI check-in</span>
          <h3 tabindex="-1">Sales completion is improving after the intervention.</h3>
          <p>AI now has enough activity to evaluate the first outcome signals.</p>
        </div>
        <p class="org-ai-check-in-label">AI check-in · Day 8 of 30</p>
        <div class="org-ai-tracking-grid">
          <article>
            <span>Campaign progress</span>
            <strong>Day 8 of 30</strong>
            <div class="org-ai-progress-bar"><i style="width: 27%"></i></div>
            <small>39 learners completed</small>
          </article>
          <article>
            <span>Completion change</span>
            <strong class="is-positive">43% &rarr; 50.4%</strong>
            <small>Compared with campaign start</small>
          </article>
          <article>
            <span>Module 3 continuation</span>
            <strong class="is-positive">38% &rarr; 54%</strong>
            <small>Learners returning after pause</small>
          </article>
        </div>
        <div class="org-ai-next-check">
          <div>
            <span>Next AI check-in</span>
            <strong>In 6 days</strong>
          </div>
          <p>AI will compare completion lift, reminder engagement, and Module 3 continuation, then recommend whether to continue or adjust.</p>
        </div>
        <div class="org-ai-action-row">
          <button class="org-ai-primary-button" type="button" data-ai-restart>Return to updated homepage</button>
          <button class="org-ai-secondary-button" type="button">Open campaign details</button>
        </div>
      </div>
    `;

     screens.slice(1).forEach((screen) => {
       screen.insertAdjacentHTML(
         "afterbegin",
         `<button class="org-ai2-inline-back org-ai2-screen-back" type="button" data-ai-prev>
           <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 5-5 5 5 5"></path></svg>
           Back
         </button>`
       );
     });

  };

  if (sourcePrototype && perspectiveTwo) {
    const perspectiveTwoPrototype = sourcePrototype.cloneNode(true);
    configurePerspectiveTwo(perspectiveTwoPrototype);
    perspectiveTwo.append(perspectiveTwoPrototype);
    sourcePrototype.closest(".org-ai-perspective")?.remove();
  }

  const prototypes = [...document.querySelectorAll("[data-org-ai-prototype]")];

  if (!prototypes.length) {
    return;
  }

  prototypes.forEach((prototype) => {
  const screens = [...prototype.querySelectorAll("[data-ai-screen]")];
  const steps = [...prototype.querySelectorAll("[data-ai-step]")];
  const backButton = prototype.querySelector(".org-ai-back-button");
  const count = prototype.querySelector(".org-ai-screen-count strong");
  const reviewMessage = prototype.querySelector("[data-ai-review-message]");
  const actionOptions = [...prototype.querySelectorAll("[data-ai-action-option]")];
  const selectedAction = prototype.querySelector("[data-ai-selected-action]");
  const optionComparison = prototype.querySelector("[data-ai-option-comparison]");
  const messagePreview = prototype.querySelector("[data-ai-message-preview]");
  const followUpAnswer = prototype.querySelector("[data-ai-follow-up-answer]");
  const homeConversation = prototype.querySelector(".org-ai-home-conversation");
  const homeInsights = prototype.querySelector(".org-ai-home-insights");
  let currentScreen = 0;

  const refreshNextActionHint = () => {
    prototype.querySelectorAll(".org-ai-next-action").forEach((element) => {
      element.classList.remove("org-ai-next-action");
    });

    const activeScreen = screens[currentScreen];
    let nextAction = activeScreen.querySelector("[data-ai-next]:not(:disabled)");

    if (currentScreen === 3) {
      const customizeButton = activeScreen.querySelector("[data-ai2-customize]");
      nextAction = customizeButton.disabled
        ? activeScreen.querySelector(".is-recommended[data-ai2-option]")
        : customizeButton;
    }

    if (currentScreen === 4) {
      const confirmation = activeScreen.querySelector("[data-ai2-launch-confirmation]");
      nextAction = confirmation && !confirmation.hidden
        ? confirmation.querySelector("[data-ai-next]")
        : activeScreen.querySelector("[data-ai2-request-launch]");
    }

    if (currentScreen === 5) {
      nextAction = activeScreen.querySelector("[data-ai2-management-toggle]");
    }

    nextAction?.classList.add("org-ai-next-action");
  };

  const syncHomeColumnHeights = () => {
    if (!homeConversation || !homeInsights || screens[0].hidden) {
      return;
    }

    if (window.matchMedia("(max-width: 720px)").matches) {
      homeInsights.style.removeProperty("height");
      homeInsights.style.removeProperty("max-height");
      return;
    }

    const conversationHeight = homeConversation.getBoundingClientRect().height;
    homeInsights.style.height = `${conversationHeight}px`;
    homeInsights.style.maxHeight = `${conversationHeight}px`;
  };

  if (homeConversation && homeInsights) {
    const homeColumnObserver = new ResizeObserver(syncHomeColumnHeights);
    homeColumnObserver.observe(homeConversation);
    window.addEventListener("resize", syncHomeColumnHeights);
  }

  const showScreen = (index, focusHeading = true) => {
    currentScreen = Math.max(0, Math.min(index, screens.length - 1));

    screens.forEach((screen, screenIndex) => {
      const isActive = screenIndex === currentScreen;
      screen.hidden = !isActive;
      screen.classList.toggle("is-active", isActive);
    });

    steps.forEach((step, stepIndex) => {
      const isActive = stepIndex === currentScreen;
      step.classList.toggle("is-active", isActive);
      step.classList.toggle("is-complete", stepIndex < currentScreen);
      step.setAttribute("aria-selected", String(isActive));
    });

    if (backButton) {
      backButton.disabled = currentScreen === 0;
    }
    if (count) {
      count.textContent = String(currentScreen + 1);
    }

    if (currentScreen === 0) {
      requestAnimationFrame(syncHomeColumnHeights);
    }

    requestAnimationFrame(refreshNextActionHint);

    if (focusHeading) {
      const heading = screens[currentScreen].querySelector("h3");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }
  };

  prototype.addEventListener("click", (event) => {
    const next = event.target.closest("[data-ai-next]");
    const previous = event.target.closest("[data-ai-prev]");
    const step = event.target.closest("[data-ai-step]");
    const review = event.target.closest("[data-ai-review]");
    const modify = event.target.closest("[data-ai-modify]");
    const assign = event.target.closest("[data-ai-assign]");
    const restart = event.target.closest("[data-ai-restart]");
    const actionOption = event.target.closest("[data-ai-action-option]");
    const compareActions = event.target.closest("[data-ai-compare-actions]");
    const previewToggle = event.target.closest("[data-ai-preview-toggle]");
    const followUp = event.target.closest("[data-ai-follow-up]");
    const perspectiveTwoQuestion = event.target.closest("[data-ai2-question]");
    const perspectiveTwoCause = event.target.closest("[data-ai2-cause-toggle]");
    const perspectiveTwoOption = event.target.closest("[data-ai2-option]");
    const perspectiveTwoSave = event.target.closest("[data-ai2-save-draft]");
    const perspectiveTwoOutcome = event.target.closest("[data-ai2-outcome-action]");
    const perspectiveTwoCheckIn = event.target.closest("[data-ai2-view-check-in]");
    const perspectiveTwoPreview = event.target.closest("[data-ai2-preview-toggle]");
    const perspectiveTwoRequestLaunch = event.target.closest("[data-ai2-request-launch]");
    const perspectiveTwoCancelLaunch = event.target.closest("[data-ai2-cancel-launch]");
    const perspectiveTwoManagementToggle = event.target.closest("[data-ai2-management-toggle]");
    const perspectiveTwoManagementAction = event.target.closest("[data-ai2-management-action]");
    const perspectiveTwoHomeMore = event.target.closest("[data-ai2-home-more-toggle]");

    if (perspectiveTwoHomeMore) {
      const morePrompts = prototype.querySelector("[data-ai2-home-more-prompts]");
      const label = perspectiveTwoHomeMore.querySelector("[data-ai2-home-more-label]");
      const willOpen = morePrompts.hidden;
      morePrompts.hidden = !willOpen;
      perspectiveTwoHomeMore.setAttribute("aria-expanded", String(willOpen));
      label.textContent = willOpen ? "See less" : "See more";
      return;
    }

    if (perspectiveTwoQuestion) {
      const answer = prototype.querySelector("[data-ai2-inline-answer]");
      prototype.querySelectorAll("[data-ai2-question]").forEach((button) => {
        button.classList.toggle("is-active", button === perspectiveTwoQuestion);
      });
      answer.textContent = perspectiveTwoQuestion.dataset.ai2Answer;
      answer.hidden = false;
      return;
    }

    if (perspectiveTwoCause) {
      const detail = perspectiveTwoCause.parentElement.querySelector("[data-ai2-cause-detail]");
      perspectiveTwoCause.dataset.closedLabel ||= perspectiveTwoCause.textContent;
      detail.hidden = !detail.hidden;
      perspectiveTwoCause.textContent = detail.hidden
        ? perspectiveTwoCause.dataset.closedLabel
        : "Hide evidence";
      return;
    }

    if (perspectiveTwoOption) {
      prototype.querySelectorAll("[data-ai2-option]").forEach((option) => {
        const isSelected = option === perspectiveTwoOption;
        option.classList.toggle("is-selected", isSelected);
        option.setAttribute("aria-checked", String(isSelected));
      });
      const customizeButton = prototype.querySelector("[data-ai2-customize]");
      customizeButton.disabled = false;
      customizeButton.textContent = "Customize selected intervention";
      refreshNextActionHint();
      return;
    }

    if (perspectiveTwoSave) {
      const feedback = prototype.querySelector("[data-ai2-review-feedback]");
      feedback.textContent = "The intervention was saved as a draft. No learners were notified.";
      feedback.hidden = false;
      return;
    }

    if (perspectiveTwoPreview) {
      const preview = prototype.querySelector("[data-ai2-campaign-preview]");
      prototype.querySelectorAll("[data-ai2-review-field]").forEach((field) => {
        const previewValue = preview.querySelector(
          `[data-ai2-preview-value="${field.dataset.ai2ReviewField}"]`
        );
        if (previewValue) {
          previewValue.textContent = field.value;
        }
      });
      preview.hidden = !preview.hidden;
      perspectiveTwoPreview.setAttribute("aria-expanded", String(!preview.hidden));
      perspectiveTwoPreview.textContent = preview.hidden
        ? "Preview campaign details"
        : "Hide campaign preview";
      return;
    }

    if (perspectiveTwoRequestLaunch) {
      const confirmation = prototype.querySelector("[data-ai2-launch-confirmation]");
      const audience = prototype.querySelector('[data-ai2-review-field="audience"]').value;
      const campaignName = prototype.querySelector('[data-ai2-review-field="campaign"]').value;
      const learnerCount = audience.match(/\d+/)?.[0] || "the selected";
      prototype.querySelector("[data-ai2-launch-campaign-name]").textContent = campaignName;
      confirmation.querySelector("strong").textContent =
        `Launch this campaign for ${learnerCount} learners?`;
      confirmation.hidden = false;
      confirmation.querySelector("strong").focus();
      refreshNextActionHint();
      return;
    }

    if (perspectiveTwoCancelLaunch) {
      prototype.querySelector("[data-ai2-launch-confirmation]").hidden = true;
      refreshNextActionHint();
      return;
    }

    if (perspectiveTwoManagementToggle) {
      const menu = prototype.querySelector("[data-ai2-management-menu]");
      const willOpen = menu.hidden;
      menu.hidden = !willOpen;
      perspectiveTwoManagementToggle.setAttribute("aria-expanded", String(willOpen));
      refreshNextActionHint();
      return;
    }

    if (perspectiveTwoManagementAction) {
      const feedback = prototype.querySelector("[data-ai2-management-feedback]");
      const menu = prototype.querySelector("[data-ai2-management-menu]");
      const toggle = prototype.querySelector("[data-ai2-management-toggle]");
      prototype.querySelectorAll("[data-ai2-management-action]").forEach((button) => {
        button.classList.toggle("is-active", button === perspectiveTwoManagementAction);
      });
      feedback.textContent = perspectiveTwoManagementAction.dataset.ai2Answer;
      feedback.hidden = false;
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      return;
    }

    if (perspectiveTwoCheckIn) {
      const launchReceipt = prototype.querySelector("[data-ai2-launch-receipt]");
      const firstCheckIn = prototype.querySelector("[data-ai2-first-check-in]");
      launchReceipt.hidden = true;
      firstCheckIn.hidden = false;
      firstCheckIn.querySelector("h3")?.focus();
      return;
    }

    if (perspectiveTwoOutcome) {
      const feedback = prototype.querySelector("[data-ai2-outcome-feedback]");
      feedback.textContent = perspectiveTwoOutcome.dataset.ai2Answer;
      feedback.hidden = false;
      return;
    }

    if (actionOption) {
      actionOptions.forEach((option) => {
        const isSelected = option === actionOption;
        option.classList.toggle("is-selected", isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
      });

      selectedAction.value = actionOption.dataset.aiActionName;
      return;
    }

    if (compareActions) {
      optionComparison.hidden = !optionComparison.hidden;
      compareActions.textContent = optionComparison.hidden ? "Compare with AI" : "Hide comparison";
      return;
    }

    if (previewToggle) {
      messagePreview.hidden = !messagePreview.hidden;
      previewToggle.textContent = messagePreview.hidden
        ? "Preview learner and manager messages"
        : "Hide message preview";
      return;
    }

    if (followUp) {
      prototype.querySelectorAll("[data-ai-follow-up]").forEach((button) => {
        button.classList.toggle("is-active", button === followUp);
      });
      followUpAnswer.textContent = followUp.dataset.aiAnswer;
      followUpAnswer.hidden = false;
      return;
    }

    if (next) {
      showScreen(currentScreen + 1);
      return;
    }

    if (previous) {
      showScreen(currentScreen - 1);
      return;
    }

    if (step) {
      showScreen(Number(step.dataset.aiStep));
      return;
    }

    if (review) {
      reviewMessage.textContent = "Review the AI-prepared settings and make any final adjustments.";
      showScreen(4);
      return;
    }

    if (modify) {
      reviewMessage.textContent = "Adjust the audience, timeline, or campaign components before approval.";
      showScreen(4);
      return;
    }

    if (assign) {
      showScreen(5);
      return;
    }

    if (restart) {
      prototype.querySelectorAll("input[type='checkbox']").forEach((checkbox, index) => {
        checkbox.checked = index < 4;
      });
      if (actionOptions.length && selectedAction) {
        actionOptions.forEach((option, index) => {
          option.classList.toggle("is-selected", index === 0);
          option.setAttribute("aria-pressed", String(index === 0));
        });
        selectedAction.value = actionOptions[0].dataset.aiActionName;
      }
      if (optionComparison) {
        optionComparison.hidden = true;
      }
      if (messagePreview) {
        messagePreview.hidden = true;
      }
      if (followUpAnswer) {
        followUpAnswer.hidden = true;
      }
      prototype.querySelectorAll("[data-ai2-question], [data-ai2-outcome-action], [data-ai2-management-action]").forEach((button) => {
        button.classList.remove("is-active");
      });
      prototype.querySelectorAll("[data-ai2-inline-answer], [data-ai2-review-feedback], [data-ai2-outcome-feedback], [data-ai2-management-feedback], [data-ai2-cause-detail]").forEach((element) => {
        element.hidden = true;
      });
      const launchReceipt = prototype.querySelector("[data-ai2-launch-receipt]");
      const firstCheckIn = prototype.querySelector("[data-ai2-first-check-in]");
      if (launchReceipt && firstCheckIn) {
        launchReceipt.hidden = false;
        firstCheckIn.hidden = true;
      }
      const managementMenu = prototype.querySelector("[data-ai2-management-menu]");
      const managementToggle = prototype.querySelector("[data-ai2-management-toggle]");
      if (managementMenu && managementToggle) {
        managementMenu.hidden = true;
        managementToggle.setAttribute("aria-expanded", "false");
      }
      const homeMorePrompts = prototype.querySelector("[data-ai2-home-more-prompts]");
      const homeMoreToggle = prototype.querySelector("[data-ai2-home-more-toggle]");
      if (homeMorePrompts && homeMoreToggle) {
        homeMorePrompts.hidden = true;
        homeMoreToggle.setAttribute("aria-expanded", "false");
        homeMoreToggle.querySelector("[data-ai2-home-more-label]").textContent = "See more";
      }
      const perspectiveTwoOptions = [...prototype.querySelectorAll("[data-ai2-option]")];
      perspectiveTwoOptions.forEach((option) => {
        option.classList.remove("is-selected");
        option.setAttribute("aria-checked", "false");
      });
      const customizeButton = prototype.querySelector("[data-ai2-customize]");
      if (customizeButton) {
        customizeButton.disabled = true;
        customizeButton.textContent = "Select an intervention";
      }
      const campaignPreview = prototype.querySelector("[data-ai2-campaign-preview]");
      const previewToggle = prototype.querySelector("[data-ai2-preview-toggle]");
      const launchConfirmation = prototype.querySelector("[data-ai2-launch-confirmation]");
      if (campaignPreview && previewToggle) {
        campaignPreview.hidden = true;
        previewToggle.setAttribute("aria-expanded", "false");
        previewToggle.textContent = "Preview campaign details";
      }
      if (launchConfirmation) {
        launchConfirmation.hidden = true;
      }
      prototype.querySelectorAll("[data-ai2-review-field]").forEach((field) => {
        field.value = field.dataset.ai2Default;
      });
      prototype.querySelectorAll("[data-ai-follow-up]").forEach((button) => {
        button.classList.remove("is-active");
      });
      showScreen(0);
    }
  });

  showScreen(0, false);
  });
});
