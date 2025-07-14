let sections = [...document.querySelectorAll("section.download-content")].filter(section => {
    const heading = section.querySelector("div>h2").innerText;
    return ["➔ Assessmentstufe", "➔ Intermediate- und Advancedstufe", "Zusatzmodule", "Blockwochen (ohne ISA)", "Erweiterungsmodule (auch Majormodule)", "Summer Schools"].includes(heading)
});

let heads = ["Kernmodule", "Kernmodule", "Projektmodule", "Projektmodule", "Erweiterungsmodule", "Zusatzmodule", "Blockwochen", "Summer Schools"]
let map = new Map();
sections.forEach((section, idx) => {
    const content = [...section.querySelectorAll("ul>li")].map(li => ({
        code: li.firstElementChild.title.replace(/(.*) *\(([^\)]+)\).*/, "$2"),
        name: li.firstElementChild.title.replace(/(.*) *\(([^\)]+)\).*/, "$1"),
        href: li.firstElementChild.href.replace("?sc_lang=de-ch", "")
    }));
    map.set(heads[idx], [
        ...map.get(heads[idx]) || [],
        ...content
    ]);
});

console.log(JSON.stringify(Array.from(map.keys()).map(key => ({
    name: key,
    modules: map.get(key)
}))));
