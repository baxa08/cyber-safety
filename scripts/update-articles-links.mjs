import { Client, Databases } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69f504b90026598bb346")
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = "cyber_db";
const COLLECTION_ID = "articles";

const linksRu = {
  article1: `
<h3>Полезные ссылки</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/definitions/what-is-cyber-security" target="_blank">Kaspersky — Что такое кибербезопасность</a></li>
<li><a href="https://www.cisco.com/c/ru_ru/products/security/what-is-cybersecurity.html" target="_blank">Cisco — Основы кибербезопасности</a></li>
<li><a href="https://netacad.com/courses/cybersecurity" target="_blank">Cisco Networking Academy — Бесплатные курсы по кибербезопасности</a></li>
<li><a href="https://www.youtube.com/watch?v=inWWhr5tnEA" target="_blank">YouTube — Кибербезопасность за 5 минут</a></li>
<li><a href="https://edu.gcfglobal.org/en/internetsafety/" target="_blank">GCFGlobal — Безопасность в интернете (уроки)</a></li>
</ul>`,
  article2: `
<h3>Полезные ссылки</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/threats/how-to-create-a-strong-password" target="_blank">Kaspersky — Как создать надёжный пароль</a></li>
<li><a href="https://bitwarden.com/password-strength/" target="_blank">Bitwarden — Проверка надёжности пароля</a></li>
<li><a href="https://haveibeenpwned.com/" target="_blank">Have I Been Pwned — Проверка утечки данных</a></li>
<li><a href="https://www.youtube.com/watch?v=3NjQ9b3pgIg" target="_blank">YouTube — Как работает двухфакторная аутентификация</a></li>
<li><a href="https://support.google.com/accounts/answer/185839" target="_blank">Google — Включение двухэтапной аутентификации</a></li>
</ul>`,
  article3: `
<h3>Полезные ссылки</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/preemptive-safety/phishing-prevention-tips" target="_blank">Kaspersky — Советы по защите от фишинга</a></li>
<li><a href="https://phishingquiz.withgoogle.com/" target="_blank">Google — Тест: сможете ли вы распознать фишинг?</a></li>
<li><a href="https://www.antiphishing.org/" target="_blank">Anti-Phishing Working Group (APWG)</a></li>
<li><a href="https://www.youtube.com/watch?v=XBkzBrXlle0" target="_blank">YouTube — Что такое фишинг и как защититься</a></li>
<li><a href="https://support.google.com/mail/answer/8253" target="_blank">Google — Как распознать фишинговые письма</a></li>
</ul>`,
  article4: `
<h3>Полезные ссылки</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/threats/how-to-protect-your-personal-data" target="_blank">Kaspersky — Защита персональных данных</a></li>
<li><a href="https://haveibeenpwned.com/" target="_blank">Have I Been Pwned — Проверьте, не утекли ли ваши данные</a></li>
<li><a href="https://privacy.google.com/" target="_blank">Google Privacy — Управление конфиденциальностью</a></li>
<li><a href="https://www.youtube.com/watch?v=yzyafieRcWE" target="_blank">YouTube — Как защитить персональные данные</a></li>
<li><a href="https://adilet.zan.kz/rus/docs/Z1300000094" target="_blank">Закон РК «О персональных данных и их защите»</a></li>
</ul>`,
  article5: `
<h3>Полезные ссылки</h3>
<ul>
<li><a href="https://www.stopbullying.gov/cyberbullying/what-is-it" target="_blank">StopBullying.gov — Что такое кибербуллинг</a></li>
<li><a href="https://www.unicef.org/end-violence/how-to-stop-cyberbullying" target="_blank">UNICEF — Как остановить кибербуллинг</a></li>
<li><a href="https://www.kaspersky.ru/resource-center/preemptive-safety/cyberbullying" target="_blank">Kaspersky — Кибербуллинг: как защитить ребёнка</a></li>
<li><a href="https://www.youtube.com/watch?v=vtHTfGuKQIA" target="_blank">YouTube — Кибербуллинг: что это и как бороться</a></li>
<li><a href="https://111.kz" target="_blank">111.kz — Горячая линия для детей и подростков (Казахстан)</a></li>
</ul>`,
  article6: `
<h3>Полезные ссылки</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/preemptive-safety/top-10-internet-safety-rules" target="_blank">Kaspersky — 10 правил безопасности в интернете</a></li>
<li><a href="https://www.eff.org/pages/tools" target="_blank">EFF — Инструменты для цифровой безопасности</a></li>
<li><a href="https://ublockorigin.com/" target="_blank">uBlock Origin — Блокировщик рекламы</a></li>
<li><a href="https://www.youtube.com/watch?v=aO858HyFbKI" target="_blank">YouTube — Как безопасно пользоваться интернетом</a></li>
<li><a href="https://transparencyreport.google.com/safe-browsing/search" target="_blank">Google Safe Browsing — Проверка безопасности сайта</a></li>
</ul>`,
  article7: `
<h3>Полезные ссылки</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/preemptive-safety/social-media-safety" target="_blank">Kaspersky — Безопасность в соцсетях</a></li>
<li><a href="https://www.instagram.com/accounts/privacy_and_security/" target="_blank">Instagram — Настройки приватности</a></li>
<li><a href="https://www.facebook.com/privacy/checkup" target="_blank">Facebook — Проверка конфиденциальности</a></li>
<li><a href="https://www.youtube.com/watch?v=nqJDnGHqXDA" target="_blank">YouTube — Безопасность в социальных сетях</a></li>
<li><a href="https://safety.google/families/" target="_blank">Google Safety Center — Безопасность для семьи</a></li>
</ul>`,
  article8: `
<h3>Полезные ссылки</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/threats/internet-scams" target="_blank">Kaspersky — Виды интернет-мошенничества</a></li>
<li><a href="https://www.fbi.gov/how-can-we-help-you/scams-and-safety" target="_blank">FBI — Мошенничество и безопасность</a></li>
<li><a href="https://www.scamadviser.com/" target="_blank">ScamAdviser — Проверка сайтов на мошенничество</a></li>
<li><a href="https://www.youtube.com/watch?v=bqoyn5yRSPQ" target="_blank">YouTube — Как распознать мошенников в интернете</a></li>
<li><a href="https://egov.kz/cms/ru/articles/internet_fraud" target="_blank">eGov.kz — Интернет-мошенничество: как защититься</a></li>
</ul>`,
  article9: `
<h3>Полезные ссылки</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/definitions/what-is-a-digital-footprint" target="_blank">Kaspersky — Что такое цифровой след</a></li>
<li><a href="https://www.internetsociety.org/tutorials/your-digital-footprint-matters/" target="_blank">Internet Society — Ваш цифровой след имеет значение</a></li>
<li><a href="https://myactivity.google.com/" target="_blank">Google My Activity — Посмотрите свою активность</a></li>
<li><a href="https://www.youtube.com/watch?v=pT19VwBAqKA" target="_blank">YouTube — Цифровой след: что это такое</a></li>
<li><a href="https://justdeleteme.xyz/" target="_blank">JustDeleteMe — Удалите неиспользуемые аккаунты</a></li>
</ul>`,
  article10: `
<h3>Полезные ссылки</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/definitions/what-is-a-vpn" target="_blank">Kaspersky — Что такое VPN</a></li>
<li><a href="https://protonvpn.com/free-vpn" target="_blank">ProtonVPN — Бесплатный VPN</a></li>
<li><a href="https://signal.org/" target="_blank">Signal — Защищённый мессенджер</a></li>
<li><a href="https://www.youtube.com/watch?v=R-JUOpCgTZc" target="_blank">YouTube — Как работает VPN</a></li>
<li><a href="https://www.privacytools.io/" target="_blank">PrivacyTools.io — Инструменты для приватности</a></li>
</ul>`,
};

const linksKk = {
  article1: `
<h3>Пайдалы сілтемелер</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/definitions/what-is-cyber-security" target="_blank">Kaspersky — Киберқауіпсіздік дегеніміз не</a></li>
<li><a href="https://www.cisco.com/c/ru_ru/products/security/what-is-cybersecurity.html" target="_blank">Cisco — Киберқауіпсіздік негіздері</a></li>
<li><a href="https://netacad.com/courses/cybersecurity" target="_blank">Cisco Networking Academy — Тегін киберқауіпсіздік курстары</a></li>
<li><a href="https://www.youtube.com/watch?v=inWWhr5tnEA" target="_blank">YouTube — Киберқауіпсіздік 5 минутта</a></li>
<li><a href="https://edu.gcfglobal.org/en/internetsafety/" target="_blank">GCFGlobal — Интернет қауіпсіздігі (сабақтар)</a></li>
</ul>`,
  article2: `
<h3>Пайдалы сілтемелер</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/threats/how-to-create-a-strong-password" target="_blank">Kaspersky — Сенімді құпия сөз жасау</a></li>
<li><a href="https://bitwarden.com/password-strength/" target="_blank">Bitwarden — Құпия сөз сенімділігін тексеру</a></li>
<li><a href="https://haveibeenpwned.com/" target="_blank">Have I Been Pwned — Деректер ағуын тексеру</a></li>
<li><a href="https://www.youtube.com/watch?v=3NjQ9b3pgIg" target="_blank">YouTube — Екі факторлы аутентификация қалай жұмыс істейді</a></li>
<li><a href="https://support.google.com/accounts/answer/185839" target="_blank">Google — Екі қадамды тексеруді қосу</a></li>
</ul>`,
  article3: `
<h3>Пайдалы сілтемелер</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/preemptive-safety/phishing-prevention-tips" target="_blank">Kaspersky — Фишингтен қорғану кеңестері</a></li>
<li><a href="https://phishingquiz.withgoogle.com/" target="_blank">Google — Тест: фишингті тани аласыз ба?</a></li>
<li><a href="https://www.antiphishing.org/" target="_blank">Anti-Phishing Working Group (APWG)</a></li>
<li><a href="https://www.youtube.com/watch?v=XBkzBrXlle0" target="_blank">YouTube — Фишинг дегеніміз не</a></li>
<li><a href="https://support.google.com/mail/answer/8253" target="_blank">Google — Фишинг хаттарды тану</a></li>
</ul>`,
  article4: `
<h3>Пайдалы сілтемелер</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/threats/how-to-protect-your-personal-data" target="_blank">Kaspersky — Дербес деректерді қорғау</a></li>
<li><a href="https://haveibeenpwned.com/" target="_blank">Have I Been Pwned — Деректеріңіз ағып кетпегенін тексеріңіз</a></li>
<li><a href="https://privacy.google.com/" target="_blank">Google Privacy — Құпиялылықты басқару</a></li>
<li><a href="https://www.youtube.com/watch?v=yzyafieRcWE" target="_blank">YouTube — Дербес деректерді қалай қорғауға болады</a></li>
<li><a href="https://adilet.zan.kz/rus/docs/Z1300000094" target="_blank">ҚР «Дербес деректер және оларды қорғау туралы» Заңы</a></li>
</ul>`,
  article5: `
<h3>Пайдалы сілтемелер</h3>
<ul>
<li><a href="https://www.stopbullying.gov/cyberbullying/what-is-it" target="_blank">StopBullying.gov — Кибербуллинг дегеніміз не</a></li>
<li><a href="https://www.unicef.org/end-violence/how-to-stop-cyberbullying" target="_blank">UNICEF — Кибербуллингті қалай тоқтатуға болады</a></li>
<li><a href="https://www.kaspersky.ru/resource-center/preemptive-safety/cyberbullying" target="_blank">Kaspersky — Кибербуллинг: баланы қалай қорғауға болады</a></li>
<li><a href="https://www.youtube.com/watch?v=vtHTfGuKQIA" target="_blank">YouTube — Кибербуллинг: бұл не және қалай күресуге болады</a></li>
<li><a href="https://111.kz" target="_blank">111.kz — Балалар мен жасөспірімдерге арналған сенім телефоны (Қазақстан)</a></li>
</ul>`,
  article6: `
<h3>Пайдалы сілтемелер</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/preemptive-safety/top-10-internet-safety-rules" target="_blank">Kaspersky — Интернет қауіпсіздігінің 10 ережесі</a></li>
<li><a href="https://www.eff.org/pages/tools" target="_blank">EFF — Цифрлық қауіпсіздік құралдары</a></li>
<li><a href="https://ublockorigin.com/" target="_blank">uBlock Origin — Жарнама блокировщигі</a></li>
<li><a href="https://www.youtube.com/watch?v=aO858HyFbKI" target="_blank">YouTube — Интернетті қауіпсіз пайдалану</a></li>
<li><a href="https://transparencyreport.google.com/safe-browsing/search" target="_blank">Google Safe Browsing — Сайт қауіпсіздігін тексеру</a></li>
</ul>`,
  article7: `
<h3>Пайдалы сілтемелер</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/preemptive-safety/social-media-safety" target="_blank">Kaspersky — Әлеуметтік желілердегі қауіпсіздік</a></li>
<li><a href="https://www.instagram.com/accounts/privacy_and_security/" target="_blank">Instagram — Құпиялылық параметрлері</a></li>
<li><a href="https://www.facebook.com/privacy/checkup" target="_blank">Facebook — Құпиялылықты тексеру</a></li>
<li><a href="https://www.youtube.com/watch?v=nqJDnGHqXDA" target="_blank">YouTube — Әлеуметтік желілердегі қауіпсіздік</a></li>
<li><a href="https://safety.google/families/" target="_blank">Google Safety Center — Отбасы қауіпсіздігі</a></li>
</ul>`,
  article8: `
<h3>Пайдалы сілтемелер</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/threats/internet-scams" target="_blank">Kaspersky — Интернет-алаяқтықтың түрлері</a></li>
<li><a href="https://www.fbi.gov/how-can-we-help-you/scams-and-safety" target="_blank">FBI — Алаяқтық және қауіпсіздік</a></li>
<li><a href="https://www.scamadviser.com/" target="_blank">ScamAdviser — Сайттарды алаяқтыққа тексеру</a></li>
<li><a href="https://www.youtube.com/watch?v=bqoyn5yRSPQ" target="_blank">YouTube — Интернеттегі алаяқтарды қалай тануға болады</a></li>
<li><a href="https://egov.kz/cms/ru/articles/internet_fraud" target="_blank">eGov.kz — Интернет-алаяқтық: қалай қорғануға болады</a></li>
</ul>`,
  article9: `
<h3>Пайдалы сілтемелер</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/definitions/what-is-a-digital-footprint" target="_blank">Kaspersky — Цифрлық із дегеніміз не</a></li>
<li><a href="https://www.internetsociety.org/tutorials/your-digital-footprint-matters/" target="_blank">Internet Society — Сіздің цифрлық ізіңіз маңызды</a></li>
<li><a href="https://myactivity.google.com/" target="_blank">Google My Activity — Белсенділігіңізді қараңыз</a></li>
<li><a href="https://www.youtube.com/watch?v=pT19VwBAqKA" target="_blank">YouTube — Цифрлық із: бұл не</a></li>
<li><a href="https://justdeleteme.xyz/" target="_blank">JustDeleteMe — Пайдаланылмайтын аккаунттарды жойыңыз</a></li>
</ul>`,
  article10: `
<h3>Пайдалы сілтемелер</h3>
<ul>
<li><a href="https://www.kaspersky.ru/resource-center/definitions/what-is-a-vpn" target="_blank">Kaspersky — VPN дегеніміз не</a></li>
<li><a href="https://protonvpn.com/free-vpn" target="_blank">ProtonVPN — Тегін VPN</a></li>
<li><a href="https://signal.org/" target="_blank">Signal — Қорғалған мессенджер</a></li>
<li><a href="https://www.youtube.com/watch?v=R-JUOpCgTZc" target="_blank">YouTube — VPN қалай жұмыс істейді</a></li>
<li><a href="https://www.privacytools.io/" target="_blank">PrivacyTools.io — Құпиялылық құралдары</a></li>
</ul>`,
};

async function main() {
  console.log("Updating articles with links...");

  for (let i = 1; i <= 10; i++) {
    const docId = `article${i}`;
    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, docId);

    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, {
      content_ru: doc.content_ru + linksRu[docId],
      content_kk: doc.content_kk + linksKk[docId],
    });

    console.log(`  ✓ article${i} updated`);
  }

  console.log("\nDone! All articles updated with links.");
}

main().catch(console.error);
