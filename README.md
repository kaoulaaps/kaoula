

<p align="center">
  <a href="https://kaoula.fly.dev">
    <img src="https://avatars.githubusercontent.com/u/111463471?s=200&v=4" alt="Kaoula logo" width="200" height="165">
  </a>
</p>

<h3 align="center">Kaoula</h3>

<p align="center">
  Next Generation School Portal🚀
<br>

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/EEF_It?referralCode=lasse)

<div align="center">

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?style=plastic)](https://github.com/lassv/kaoula/blob/master/LICENSE)

</div>

---

## About

Kaoula is a next generation school program. There you can have classes with gruops of students. With cool features like:

-   Give homework to your students
-   Message your students
-   Overwiew where you can share news information.
-   Create a calendar for your students.
-   Join classes with a invite code.
-   Teacher settings dashboard where you can control your class.
-   And much more.

## Images

[![](https://i.ibb.co/mc7zctM/kaula-example.png)](https://kaoula.hypll.org)
[![](https://i.ibb.co/DzBpZ1R/settings-kaula.png)](https://kaoula.hypll.org)
[![](https://i.ibb.co/TR5sSLp/userdasuhboard.png)](https://kaoula.hypll.org)

## Local Setup

Download the source code

```bash
git clone https://github.com/kaoulaaps/kaoula.git
```

Install dependencies

```bash
pnpm (npm) install
```

Config `.env` <br>
Rename the `.env.example`to `.env` and fill out all the required fields. (MongoDB, PORT, HOST, API_TOKEN, NODE_ENV, GOOGLE...)

Run the server

```bash
cd kaoula
pnpm run dev
```

And then your server is ready at `http://localhost:{PORT}`
