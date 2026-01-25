[33mcommit 9067bd3eeee182f3438555001b1a40cd77625c3a[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m)[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sun Jan 25 18:38:44 2026 +0200

    Refined SharePopup prop usage, added visibleToGuest state/prop, fixed EditorButtons bugs

[33mcommit 704b86e86021e7c026e85e0e98df9611ba3e84e0[m[33m ([m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sun Jan 25 18:15:51 2026 +0200

    passed down canView, canEdit, isPrivate props to Editor->SharePopup, correct state is now store. Dilemma: distinguishing between canView and canEdit users??

[33mcommit b43e929015e1e208bdace1d29c6123bb26f0ee83[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sun Jan 25 17:23:05 2026 +0200

    passed content state down to Editor.tsx and EditorField.tsx, content changes should be stored in frontend now

[33mcommit dc6a0ecb8324fbdf53bdc04bd25157ca5dc35b5d[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sun Jan 25 17:17:25 2026 +0200

    added EN button (MVP language picker

[33mcommit aba06d83cdb7f74d27ab35d61d0f04dc0baa5eec[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sun Jan 25 17:11:55 2026 +0200

    outlining DB POSTs and editable attributes in Editor.tsx; refined directory structure

[33mcommit 4192f43de208809b6cebd2bc28fe7958b8e505f2[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sun Jan 25 16:39:27 2026 +0200

    created UploadFileDialog.tsx, DB save logic not implemented

[33mcommit 2d7465f53097b4a888e286c636f1330a8e447e66[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sun Jan 25 00:12:44 2026 +0200

    outlined file-saving logic

[33mcommit a4e279f16d43f1871229d326d6f80ec4bdfaac2b[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sun Jan 25 00:09:22 2026 +0200

    tryna make the editor field view-only

[33mcommit 6535304e0facd483508a7baa03504412bd7031e3[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sat Jan 24 23:40:07 2026 +0200

    more dialog components created

[33mcommit 824050b8fe7b4abf7cb4a59dbfc5842a385e3404[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sat Jan 24 23:13:49 2026 +0200

    created ClonePopup component, UI fine, actions don't work yet

[33mcommit e4ac0fb5863f966fa61828c2e5f1e7891793366f[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sat Jan 24 22:51:56 2026 +0200

    share popup component half-done, clipboard copying works, main elements added, not connected with the server yet at all

[33mcommit a0b41c0d325cca82a6d82442bdcb8d4e16cc78b9[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sat Jan 24 21:53:21 2026 +0200

    logout works in settings, menu, other menu options is progress

[33mcommit d8ef0a2f0201a11e125d48b437ac7e5c5ce0347a[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sat Jan 24 21:30:37 2026 +0200

    started working on the settings menu, changed the page header, added Avatar and DropdownMenu shadcn components

[33mcommit 02a3acc939c95f81cc4b4e480124a2ab8af45246[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sat Jan 24 20:56:53 2026 +0200

    SERVER fixed backend mismatches; FRONTEND fixed bugs

[33mcommit 8111be9fd3fe2655795632f755cd5743df939bed[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sat Jan 24 20:38:45 2026 +0200

    passed down setUserData to child components through props; created test user and file data mimicking the DB structure

[33mcommit 1f9c35e3b482e3b5f93d7eb770a1b2370129cb9f[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sat Jan 24 19:49:18 2026 +0200

    moved userData state up from Home.tsx to App.tsx pt2

[33mcommit b3debfb53818c8d25118f78716de96f32a856ca7[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sat Jan 24 19:45:48 2026 +0200

    moved userData state up from Home.tsx to App.tsc

[33mcommit 2f7e7ffb0828175d023e0b5cae80fac97bbb0531[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Sat Jan 24 19:32:55 2026 +0200

    added comments in frontend,  to where communication with the server will be

[33mcommit 8170f2ef746c1abb91ac518b6159d656e7f4872a[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Fri Jan 23 00:46:15 2026 +0200

    still working on filtering popup, refactoring, fixing errors

[33mcommit 72f91897ed01d8dca53bdf61d202ec39f8360dca[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 22 15:53:24 2026 +0200

    filter popup is functional now, just need to implement it into the filestable logic

[33mcommit a6ddbcf65036d8de15b5d63b77d1ca40f3542aa1[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Wed Jan 21 17:49:45 2026 +0200

    started creating the filter popup window

[33mcommit 26eeb9623a08d1cb37a295526811284bae69144b[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Wed Jan 21 16:58:37 2026 +0200

    set up editor menu with tiptap; added some tooltip buttons to editorview (bruteforce creation for now)

[33mcommit 99c26ff36717bcc5d3803fd49dea95442b52d83f[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Wed Jan 21 15:29:27 2026 +0200

    search results bug fixed

[33mcommit 66b49979a4f7ea74423fb8bdae2d079c60c23cd9[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Wed Jan 21 15:02:43 2026 +0200

    fixed rendering bugs after login

[33mcommit 82c4a2f100e4339ad58e68b249ffc983d10c2a9e[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Wed Jan 21 14:39:53 2026 +0200

    token refresh bugs fixed by adding props to children of app.tsx

[33mcommit 123d66bdff036232e028b96043a0d6c61f5a9abd[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Tue Jan 20 12:02:21 2026 +0200

    login home redirection bug fixed

[33mcommit aa4a496927b7b94f388cd627cf01b482ec395701[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Tue Jan 20 11:33:20 2026 +0200

    table sorting works now

[33mcommit a3c3307b615b54cda4a28dfafc924012f544323f[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 20:33:20 2026 +0200

    home is now only rendered for the logged in user

[33mcommit 84f8a9eb81d769a4adff09c56bcbbb7578b952a8[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 20:27:56 2026 +0200

    doubleclick -> editor routing works

[33mcommit ee5c6fc5846342f0555eed0f3f4746ddc1a7f7c1[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 20:22:03 2026 +0200

    shadcn table, editorbuttons and editor created and refined

[33mcommit ef8e6c8502b35cb1dd4c8f36d7c378a90db53231[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 19:39:34 2026 +0200

    successfully added two shadcn components

[33mcommit 54d50cbcda0ee6d2c1878652b1ecd06c642cdd66[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 18:41:27 2026 +0200

    logout button works

[33mcommit f911f0b1add1ee9cf6a7d8aca3a0e6bb0b4e30a4[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 18:39:37 2026 +0200

    successful login on frontend

[33mcommit 0b1e0bb7e40884d8bb8b8f43a6c0fb9c77f0725f[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 18:13:35 2026 +0200

    set up cors;added some stuff to frontend auth components (still in progress)

[33mcommit da892202b73f234b589d7f4ab1a182a7ae87903c[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 16:16:59 2026 +0200

    FRONTEND initial outline of react components pt2

[33mcommit d49820ce0b2be48e70120e4a49d249e115ef6704[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 16:01:02 2026 +0200

    FRONTEND added core react components initial structure

[33mcommit 1d960396c837b712aca5df256d00b8c057ac430f[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 15:42:36 2026 +0200

    fixed syntactical issues in user.ts routes

[33mcommit 98f768e6248ae83f4526f9182910c0a2be469b23[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 15:29:06 2026 +0200

    tryna do owner authorization

[33mcommit 55b81baeec8c57fac5227b4d1f55c96e001acc34[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 15:15:01 2026 +0200

    added user and admin validation methods, not used in the backend routes yet

[33mcommit aa2c22a7a57928b6e3152a4487c40a5a031d034f[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 19 15:13:37 2026 +0200

    idk what I'm doing, tryna fix bugs

[33mcommit 17e8c57611b58cb7ef160cdae36f608fe0a016e6[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 16:55:23 2026 +0200

    added plans for mode changing (user.ts), needs implementation

[33mcommit 74a3d0f182b69ce70ac811634556e341a1d59ebf[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 16:17:24 2026 +0200

    implemented get routes to (pagination), sorting and filters in session.ts

[33mcommit 05d26db8182d426f5ef3e22de346eb58ab149b76[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 16:14:01 2026 +0200

    removed error from session.ts

[33mcommit ca66507dd07adaca7ed49b144836a440710db254[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 16:08:46 2026 +0200

    implemented more routers in file.ts and session.ts, refactored DB structure and I.. interfaces along the way

[33mcommit af0c0d28882c1682876354b51fe3262dd0fc9ba2[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 15:21:07 2026 +0200

    implemented some routers in file.ts

[33mcommit 67ecaee66efa3c647d32c9a7db3a8fceaecd13e0[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 14:51:51 2026 +0200

    implemented session sorting and pagination UPDATE routes

[33mcommit 8af3f307de6d295e5c13e35b238cb121d871d60c[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 14:48:25 2026 +0200

    implemented session filter UPDATE route (remove_all)

[33mcommit 0a7ee0d5accaecabfbc102879e6713eb07591d96[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 14:46:20 2026 +0200

    implemented session filter UPDATE route (remove)

[33mcommit 8d9da2118d010857b6ebde1663712f2c19e8046e[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 14:35:47 2026 +0200

    altered Session schema, started implementing session filter UPDATE route

[33mcommit 3071ec4ed9c994ec2a6ba9aa5f022c1457adce24[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 14:18:50 2026 +0200

    added GET user profile pic to user.ts

[33mcommit a58b7bcd692b95444303d0185c8b232d7fdd2be1[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 14:14:52 2026 +0200

    user.ts last two routes edited (profilepic changing feature), minimal testing done

[33mcommit f43fbe5e5f57eada0932eb533f5b24a4bb85656b[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 14:09:59 2026 +0200

    user.ts last two routes edited (profilepic changing feature), no testing done

[33mcommit 022fc8da4d896f0bc8c6f403c079b137ba6f9ae4[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Thu Jan 15 00:25:01 2026 +0200

    added more planning and design to file.ts routers

[33mcommit ddd793df431296d31ccac2794e414f8116b52df0[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Wed Jan 14 23:51:15 2026 +0200

    added multer functionality (storing image in DB), no tests done at all; API endpoint handling code still needs to be modified

[33mcommit 66562478c344b740fb500b2d1c24ef2618bd3eb8[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Wed Jan 14 23:34:02 2026 +0200

    changed db implementation by adding schema-schema dependencies; added routing details to file.ts

[33mcommit 784d22eced6f78c9fdb8ca92e015a57dbaaf682b[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Tue Jan 13 22:02:13 2026 +0200

    added more planning to file.ts; created and started planning session.ts

[33mcommit 9752e899f5f6de6fb6ce6c3d6719bf6d9787be32[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Tue Jan 13 21:55:44 2026 +0200

    BACKEND implemented and tested (with thunderstorm) register and login routes; Google auth is not perfect yet nor is it tested; tried mock testing using /public but didn't work, added custom input validations, added file.ts for backend communication regarding file data

[33mcommit c2a58d3cc9d19e53777e6e648931059e3d727ff2[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 12 18:24:25 2026 +0200

    app.js made, created DB models (user, file, session) rough draft of API endpoints. no testing done, copied auth code that needs to be modified next time

[33mcommit 4ce18caaa5de37be5af6b5364c4c96efd5bda27e[m
Author: lillabbbbbb <128832523+lillabbbbbb@users.noreply.github.com>
Date:   Mon Jan 12 16:43:16 2026 +0200

    initial project structure established (git, frontend, backend) with vague comments on what purpose each file (on the backend) has
