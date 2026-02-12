Please look at the "F:\Dx\apps\www" path folder where you can find "F:\Dx\apps\www\public\icons" json files and and "F:\Dx\apps\www\public\svgl" folder there is svg icons for svgl icon sets now in our crates/apps gpui rust desktop app we have to show that icons as in the www folder nextjs project so Please do a web search about the latest Zed's GPUI on 10th February 2026 and create an icon picker with a list of all the icons. As the root app/www next day's website we have did. At the trace icon folder, there you can find enough based icon searcher and lister, so please use that to do all of the searching and listing of the icons of our apps and use all data like the next day's public folder, hbcl folder, and icons folder icons. 
Please clarify all the things and ask me questions to clarify all the things!!!

Please look at the root crates/app folder. There we are giving icon search app UI using Zed's GPUI Rust crate. But currently we are not actually showing the real SVGs. So please do a web search and learn how to show real SVGs in Rust GPUI and show them correctly. Also, the app is lagging so mass. Please do a web search to load the icon in a way that it doesn't lag. 

Please do a web search about how zed code editor show icons in their code code editor as they also use gpui and learn from it and apply it here too!!! and also currently the icons are not showinga nd also the whole app is too much lagging so just so only 100 icons for now!!!

If you can't do it please create markdown asking another good ai about how zed team uses svg in their code editor and how we are using it that is not actully showing the svg icons and ask for correct way!!!

So, svgl Icons are colorful icons, so they are not matching the light and dark theme properly. We learnt how to show icons properly, right? Please use this system to show all icons from JSON files using our Crates icon and root app/www/public/icons/*.json files svg data
Awesome, now the icons are showing correctly. Previously, we were showing 300K+ icons with 229 icon packs, but we switched to just showing 10 icons to tackle the GPU UI HVC rendering. Now that the HVC are rendering correctly, please use our previous logic to show an icon searcher in the menu UI and make sure to load less icons so that the app doesn't laggy.

Awesome! Now the icons are showing correctly. Now we have to do this 3 tasks: Do a web search and learcn how we can do this using gpui in 11 February 2026
1. We have to show the topbar of the our app with system top rigth action with tab minimizer, closer and and so on
2. And in the ui the when we hover on svg cards it should have primary-foreground as the background and also the svgs cards click should work correctly
3. Learn how to do interactions in gpui as we we have to create components like shadcn-ui like select and other resueable component and use them in our app correctly with professional folder and structure and all best practices!!!

Good, now please use those components correctly and also do web search that you are using rigth modules from gppui to create those copmonent correclty and properly use those components!!!

First of all, please use danger color as background when hovered in SVG card, and make the search bar and the icon pan drop-down functional in our app. Even though you change the hover color to danger, it's not actually showing the color in the HVC card, so please fix it. Also, please use the search bar icon-set icon instead of the emojis. In our whole app, please don't use any emojis and use icons as we are an icon search app. So, please don't use emojis, use icons. 

Today is 11 February 2026. I want to create a ChatShain-like UI system of components using Rust GPUI. Now you don't have to give any code for creating those UI components but please do a code search on the Zed's GPUI Raster Crate and its implementation and mainly the latest implementation done by the Zed official team. Please give me a professional document listing all the interactions and how to do those interactions in GPUI in the latest versions. You don't have to give any code; just give me instructions about all the instructions and how we should apply those interactions like hover, on click, double click, search bar etc in GPUI apps correctly. Don't give any long code; just give me instructions by searching the Zed GitHub repo and Zed GPUI codebase and official implementations by Zed team.

Still we are using emojis, so please don't use any emojis in our app. Also, please make all the components in our app interactive by doing a web search and learning from this documentation:
```markdown
# GPUI User Interactions Guide  
*(Based on the latest Zed GPUI implementations as of February 2026)*

GPUI's interaction system is built around declarative element builders that automatically manage hitboxes, event routing, and visual state (hovered, active, focused) when interaction methods or state-dependent styles are applied. Attaching any interaction handler or state-based style (e.g., `.hovered()` or `.active()`) makes the element interactive, creating an implicit hitbox for mouse detection. Events propagate from child to parent unless explicitly stopped.

## 1. Hover Interactions
- Hover is primarily used for visual feedback rather than actions.
- Apply hover-specific styling with the `.hovered()` modifier on any element builder.
- This automatically enables hover detection and changes the cursor if a pointer style is specified.
- Common applications: background changes, borders, shadows, or cursor shifts to indicate interactivity.
- Combine with `.cursor(CursorStyle::PointingHand)` for clickable appearance.
- No separate "on_hover" action handler exists; hover state is queried implicitly through styling or manually via hitbox checks for advanced cases.

## 2. Click and Double-Click Interactions
- Primary click handling uses the `.on_click()` method on the element builder.
- The handler receives a `ClickEvent` containing button, position, modifiers, and a click count.
- Detect double-clicks by checking the click count value (typically == 2 for double, >2 for triple).
- Single-click logic can be separated or combined within the same handler.
- Stop event propagation if the click should not bubble to parent elements.
- For left-click only, `.on_click()` is sufficient; other buttons require separate handling.

## 3. Right-Click and Secondary Mouse Buttons
- Right-clicks are handled via `.on_mouse_down(MouseButton::Right, ...)` or by checking the button inside a general click/mouse-down handler.
- Some components support a dedicated `.on_right_click()` extension for convenience.
- Use this for context menus or secondary actions.

## 4. Mouse Down, Up, and Move
- Fine-grained control uses:
  - `.on_mouse_down(button, handler)` – triggered on button press.
  - `.on_mouse_up(button, handler)` – triggered on button release.
  - `.on_mouse_move(handler)` – triggered continuously while the pointer is over the element.
- Useful for custom selection, dragging previews, or complex gestures.
- Handlers receive appropriate mouse event structs with position, modifiers, and phase information.

## 5. Active (Pressed) State
- Visual feedback for pressed state uses the `.active()` modifier.
- Applies styles only while a mouse button is held down over the element.
- Commonly used with hover for full button-like appearance (normal → hovered → active).

## 6. Drag and Drop
- Make an element a drag source with `.draggable()` (optionally providing a payload or preview).
- Handle drops on target elements with `.on_drop(|payload, cx| ...)`.
- Track drag movement with `.on_drag_move()` or `.on_drag_over()` for visual feedback.
- GPUI handles platform-native drag-and-drop when configured.

## 7. Keyboard and Focus Interactions
- Make an element focusable with `.focusable()`.
- Attach focus handlers via `.on_focus_in()` and `.on_focus_out()`.
- Programmatic focus uses a focus handle obtained during element construction.
- Key events on focused elements are typically handled via typed actions or global bindings.
- Register key bindings with `cx.bind_keys()` for application-wide or scoped shortcuts.
- Specific components (buttons, inputs) often support `.on_action()` for typed command dispatch.

## 8. Text Input and Search Bars
- Text input uses the dedicated `TextField` component.
- Create and configure it with an ID and initial value.
- Track changes in real-time with `.on_change(|new_text: String, cx| ...)`.
- Handle submission (e.g., Enter key) with `.on_submit(|text, cx| ...)`.
- Add placeholders via `.placeholder("...")`.
- For a full search bar:
  - Wrap the `TextField` in a horizontal container.
  - Add leading/trailing icons (e.g., magnifying glass, clear button).
  - Apply unified styling (padding, rounding, background, border).
  - Show/hide a clear button conditionally based on text length.
  - Combine with focus handling for auto-select or keyboard shortcuts.

## 9. Advanced / Manual Hitbox Control
- For cases needing precise control (overlapping elements, custom scroll handling):
  - Insert an explicit hitbox during layout/preparation phase.
  - Configure behavior (e.g., ignore behind, capture scroll).
  - Query state manually: `is_hovered()`, `is_active()`, `should_handle_scroll()`.
- Use sparingly; most interactions are covered by the declarative methods above.

## General Best Practices
- Listeners are created with `cx.listener(|view, event, cx| ...)` for proper view binding.
- Always consider event propagation – stop when necessary to avoid unintended parent handling.
- Combine visual state modifiers (`.hovered()`, `.active()`) with action handlers for complete interactive components.
- For accessibility, ensure focusable elements have appropriate keyboard support and visible focus indicators.

This guide reflects patterns used throughout Zed's own UI implementation and the public GPUI API. Refer to Zed's source examples for real-world component compositions (buttons, list items, panels, toolbars, inputs).
```

Good, but in the tabs, when I am clicking in the tabs, if my mouse is inside the whole app window, still the tabs are not being background-activated. But when I am going outside the app window, it's being activated, and also the hover has so much delay, so it's filling and making a weird UI. Please make sure that when hovered, it shows the hovered item instantly, and also the tabs will have the activated background. When we move click on the tabs, no need to move cursor outside of the app to actually activate it. So please fix all these UI problems, and also the search bar is just dummy, it's not working at all. So please fix the search bar too. 

Good, now the tabs' active functionality is working correctly, but the hover is still not working, and also when clicking on the search bar. It should give text input text cursor, but now it's just filtering some dummy data while I click on the search bar. So please make the search bar to input text instead of doing this. We add click dummy data search. 

Good! Now please do another deep dive in Zed's GPUI and give me a big instruction about all the details using GPUI like how can we use the GPUI to create complex apps with images, videos, links, shadcn-ui like UI Components that is buildable by all the desktops like Mac OS, Linux, Windows correctly and give me full details like don't give me too much details but give me little details about the official code implementations of the GPUI of those functionalities but don't give me too much code just enough to actually use it. That's it!

I am creating a software called DX. It means Enhanced Development Experience. Mostly focused on software-related tasks, but it's for now and in future will grow to any field of life. Currently in DX we have already many tools like Forge Style, Serializer, Media, Icon, Font, Check, and many others. In DX we have also a 24/7 running agent that will be an agent that can connect to more than 400 pillars, apps, and automate tasks. In DX we also have a desktop app to control your DX account. Your DX agent will be a CLI, so it will be like a GUI app for DX where you can not only control your CLI agent but also other DX related features. Now, currently all DX tools are completed and CLI is almost completed too. We are now working to create DX's main official website and DX CLI, which will be in Rust, GPU by Jet Team. The whole DX is built using Rust for performance and security. Now, we have to create our DX official website. And for the website, I choose latest Nick JS in the company with all React JS and Nick JS popular helpful packages like zod, ReactQuery, zustand and other popular packages. For styling, I will use Shadcn UI and TellWind CSS and motion library for animations. There should be a landing page. Prefer authentication using WeatherHawk auth library. When logged in, we will show the DX-Reaction board.
DX is a different kind of website where in the bottom of the landing page or inside the whole website, there should be a Mac OS like dockbar that list all DX tools.
As DX is a different kind of website, like these has different tools that have their different pages and documentation pages. So when click on those Docs, then we will redirect to that specific tool detail space that will have that specific tools related website structure.
Also, for user engagement, DX will introduce a guest chatting in the bottom dockbar where it will create a group-like call without any audio or video, just use text to join around with other different people who is also seeing DX website. They can collaborate with each other using text. Please create a system instruction file to tell the code editor to use all latest packages, maintain a proper, professional, and production-ready 10/10 codebase, and do all best practices while making the Dx website. 
