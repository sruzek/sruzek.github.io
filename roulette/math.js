$(function () {
    function e() {
        var e = JSON.parse(localStorage.getItem("history")) || [];
        if (
            ($("#history-list").empty(),
            e.length > 0
                ? ($(".all-stats-outer").show(),
                  e.reverse().forEach(function (e) {
                      $("#history-list").append('<li data-number="' + e + '">' + e + "</li>");
                  }),
                  $("#copy-button").removeAttr("disabled"))
                : ($(".all-stats-outer").hide(),
                  $("#copy-button").attr("disabled", "disabled"),
                  $("#history-list").append('<li class="no-history">Select the number from the left hand side where the ball landed on the roulette wheel. Make smart bets.</li>')),
            $(".the-history .history-count").empty(),
            $(".the-history > h2").append(' <span class="history-count">(' + e.length + " items)</span>"),
            e.length % 10 == 0 && 0 != e.length)
        ) {
            $(".overlay, .ad-popin").fadeIn();
            var t = 5;
            $("#close-popup").prop("disabled", !0), $("#close-popup").addClass("disabled"), $("#countdown").show(), $("#countdown").html("please, wait " + t + 's<br />to close this.<br /><a href="/become-pro/">Go Pro</a> to remove ads.');
            var s = setInterval(function () {
                t--,
                    $("#countdown").html("please, wait " + t + 's<br />to close this.<br /><a href="/become-pro/">Go Pro</a> to remove ads. '),
                    0 === t && (clearInterval(s), $("#close-popup").prop("disabled", !1), $("#close-popup").removeClass("disabled"), $("#countdown").hide());
            }, 1e3);
        }
    }
    $("#close-popup").click(function () {
        $(".overlay, .ad-popin").hide();
    });
    var t = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
        s = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
        l = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
        n = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        d = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        r = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        o = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
        u = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        c = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
        b = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
        _ = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
        m = [1, 2, 3],
        h = [4, 5, 6],
        p = [7, 8, 9],
        g = [10, 11, 12],
        f = [13, 14, 15],
        C = [16, 17, 18],
        y = [19, 20, 21],
        v = [22, 23, 24],
        S = [25, 26, 27],
        x = [28, 29, 30],
        k = [31, 32, 33],
        w = [34, 35, 36],
        D = [1, 2, 3, 4, 5, 6],
        N = [7, 8, 9, 10, 11, 12],
        I = [13, 14, 15, 16, 17, 18],
        B = [19, 20, 21, 22, 23, 24],
        E = [25, 26, 27, 28, 29, 30],
        A = [31, 32, 33, 34, 35, 36];
    function R() {
        var R, z, P, O, H, T, F, G, L, q, j, M, X, Y, Z;
        !(function e() {
            for (var t = JSON.parse(localStorage.getItem("history")) || [], s = {}, l = 0; l <= 36; l++) s[l] = 0;
            for (var n = 0; n < t.length; n++) s[t[n]]++;
            var d = Object.keys(s).sort(function (e, t) {
                    return s[t] - s[e];
                }),
                a = $("#hot-numbers-list");
            a.empty();
            for (var r = 0; r < d.length; r++) {
                var o = d[r],
                    u = s[o];
                r <= 12 && a.append('<div class="item-num" data-number="' + o + '">' + o + '</div><div class="item-qtd">' + u + "</div>");
            }
        })(),
            (function e() {
                for (var t = JSON.parse(localStorage.getItem("history")) || [], s = {}, l = 0; l <= 36; l++) s[l] = 0;
                for (var n = 0; n < t.length; n++) s[t[n]]++;
                var d = Object.keys(s).sort(function (e, t) {
                        return s[e] - s[t];
                    }),
                    a = $("#cold-numbers-list");
                a.empty();
                for (var r = 0; r < d.length; r++) {
                    var o = d[r],
                        u = s[o];
                    r <= 12 && a.append('<div class="item-num" data-number="' + o + '">' + o + '</div><div class="item-qtd">' + u + "</div>");
                }
            })(),
            e(),
            (function e() {
                var u = JSON.parse(localStorage.getItem("history")) || [];
                if (($("#current-status tbody").empty(), u.length > 0)) {
                    var c = 1,
                        R = "";
                    u.reverse().forEach(function (e) {
                        if ((e = parseInt(e)) >= 0 && e <= 36) {
                            var u, z, P, O, H, T, F;
                            (u = t.includes(e) ? "Red" : s.includes(e) ? "Black" : "Green") === R ? c++ : (c = 1),
                                (R = u),
                                (z = b.includes(e) ? "Even" : _.includes(e) ? "Odd" : "-"),
                                (P = e <= 18 && e > 0 ? "Low" : e >= 19 ? "High" : "-"),
                                (O = l.includes(e) ? "Col 1" : n.includes(e) ? "Col 2" : d.includes(e) ? "Col 3" : "-"),
                                (H = a.includes(e) ? "1st12" : r.includes(e) ? "2nd12" : o.includes(e) ? "3rd12" : "-"),
                                (T = m.includes(e)
                                    ? "St 1 "
                                    : h.includes(e)
                                    ? "St 2 "
                                    : p.includes(e)
                                    ? "St 3 "
                                    : g.includes(e)
                                    ? "St 4 "
                                    : f.includes(e)
                                    ? "St 5 "
                                    : C.includes(e)
                                    ? "St 6 "
                                    : y.includes(e)
                                    ? "St 7 "
                                    : v.includes(e)
                                    ? "St 8 "
                                    : S.includes(e)
                                    ? "St 9 "
                                    : x.includes(e)
                                    ? "St 10 "
                                    : k.includes(e)
                                    ? "St 11 "
                                    : w.includes(e)
                                    ? "St 12 "
                                    : "-"),
                                (F = D.includes(e) ? "DS 1 " : N.includes(e) ? "DS 2 " : I.includes(e) ? "DS 3 " : B.includes(e) ? "DS 4 " : E.includes(e) ? "DS 5 " : A.includes(e) ? "DS 6 " : "-"),
                                $("#current-status tbody").append(
                                    '<tr><td class="number"><div data-number="' +
                                        e +
                                        '">' +
                                        e +
                                        '</div></td><td class="color">' +
                                        u +
                                        '</td><td class="even-odd">' +
                                        z +
                                        '</td><td class="low-high">' +
                                        P +
                                        '</td><td class="dozen">' +
                                        H +
                                        '</td><td class="column">' +
                                        O +
                                        '</td><td class="street">' +
                                        T +
                                        '</td><td class="doubleStreet">' +
                                        F +
                                        "</td></tr>"
                                );
                        }
                    });
                }
            })(),
            (function e() {
                var t = JSON.parse(localStorage.getItem("history")) || [];
                for ($("#numbers-count").empty(), i = 0; i <= 36; i++) {
                    for (var s = 0, l = 0; l < t.length; l++) t[l] == i && s++;
                    $("#numbers-count").append('<div class="item-num" data-number="' + i + '">' + i + '</div><div class="item-qtd">' + s + "</div>");
                }
            })(),
            (function e() {
                for (
                    var t,
                        s,
                        l,
                        n,
                        d,
                        a,
                        r,
                        o,
                        u,
                        c,
                        b,
                        _,
                        m,
                        h,
                        p,
                        g,
                        f,
                        C,
                        y,
                        v,
                        S,
                        x,
                        k,
                        w,
                        D,
                        N,
                        I,
                        B,
                        E,
                        A,
                        R,
                        z,
                        P,
                        O,
                        H,
                        T,
                        F,
                        G = JSON.parse(localStorage.getItem("history")) || [],
                        L = { black: 0, red: 0 },
                        q = { low: 0, high: 0 },
                        j = { even: 0, odd: 0 },
                        M = 0,
                        X = 0,
                        Y = 0,
                        Z = 0,
                        J = 0,
                        K = 0,
                        Q = 0,
                        U = 0,
                        V = 0,
                        W = 0,
                        ee = 0,
                        et = 0,
                        es = 0,
                        el = 0,
                        en = 0,
                        ed = 0,
                        ea = 0,
                        ei = 0,
                        er = 0,
                        eo = 0,
                        eu = 0,
                        ec = 0,
                        eb = 0,
                        e_ = 0,
                        em = 0;
                    em < G.length;
                    em++
                ) {
                    var eh = G[em];
                    (eh >= 1 && eh <= 10) || (eh >= 19 && eh <= 28) ? (eh % 2 == 0 ? L.black++ : L.red++) : ((eh >= 11 && eh <= 18) || (eh >= 29 && eh <= 36)) && (eh % 2 == 0 ? L.red++ : L.black++),
                        eh >= 1 && eh <= 18 ? q.low++ : q.high++,
                        eh % 2 == 0 ? j.even++ : j.odd++,
                        eh >= 1 && eh <= 12 ? M++ : eh >= 13 && eh <= 24 ? X++ : eh >= 25 && eh <= 36 && Y++,
                        eh % 3 == 1 ? Z++ : eh % 3 == 2 ? J++ : K++,
                        eh >= 1 && eh <= 3
                            ? Q++
                            : eh >= 4 && eh <= 6
                            ? U++
                            : eh >= 7 && eh <= 9
                            ? V++
                            : eh >= 10 && eh <= 12
                            ? W++
                            : eh >= 13 && eh <= 15
                            ? ee++
                            : eh >= 16 && eh <= 18
                            ? et++
                            : eh >= 19 && eh <= 21
                            ? es++
                            : eh >= 22 && eh <= 24
                            ? el++
                            : eh >= 25 && eh <= 27
                            ? en++
                            : eh >= 28 && eh <= 30
                            ? ed++
                            : eh >= 31 && eh <= 33
                            ? ea++
                            : eh >= 34 && eh <= 36 && ei++,
                        eh >= 1 && eh <= 6 ? er++ : eh >= 7 && eh <= 12 ? eo++ : eh >= 13 && eh <= 18 ? eu++ : eh >= 19 && eh <= 24 ? ec++ : eh >= 25 && eh <= 30 ? eb++ : eh >= 31 && eh <= 36 && e_++;
                }
                $("#black-red-count").text("Black: " + L.black + ", Red: " + L.red),
                    $("#low-high-count").text("Low: " + q.low + ", High: " + q.high),
                    $("#even-odd-count").text("Even: " + j.even + ", Odd: " + j.odd),
                    $("#first-12-count").text("1st12: " + M),
                    $("#second-12-count").text("2nd12: " + X),
                    $("#third-12-count").text("3rd12: " + Y),
                    $("#column-1-count").text("Col 1: " + Z),
                    $("#column-2-count").text("Col 2: " + J),
                    $("#column-3-count").text("Col 3: " + K),
                    $("#street-1-count").text("St 1: " + Q),
                    $("#street-2-count").text("St 2: " + U),
                    $("#street-3-count").text("St 3: " + V),
                    $("#street-4-count").text("St 4: " + W),
                    $("#street-5-count").text("St 5: " + ee),
                    $("#street-6-count").text("St 6: " + et),
                    $("#street-7-count").text("St 7: " + es),
                    $("#street-8-count").text("St 8: " + el),
                    $("#street-9-count").text("St 9: " + en),
                    $("#street-10-count").text("St 10: " + ed),
                    $("#street-11-count").text("St 11: " + ea),
                    $("#street-12-count").text("St 12: " + ei),
                    $("#doubleStreet-1-count").text("DS 1: " + er),
                    $("#doubleStreet-2-count").text("DS 2: " + eo),
                    $("#doubleStreet-3-count").text("DS 3: " + eu),
                    $("#doubleStreet-4-count").text("DS 4: " + ec),
                    $("#doubleStreet-5-count").text("DS 5: " + eb),
                    $("#doubleStreet-6-count").text("DS 6: " + e_),
                    (t = L.red),
                    (s = L.black),
                    (l = document.getElementById("blackRedChart").getContext("2d")),
                    window.myblackRedChart && window.myblackRedChart.destroy(),
                    (window.myblackRedChart = new Chart(l, { type: "pie", data: { labels: ["Red", "Black"], datasets: [{ backgroundColor: ["#c00", "#000"], data: [t, s] }] }, options: { plugins: { legend: { display: !1 } } } })),
                    (n = q.low),
                    (d = q.high),
                    (a = document.getElementById("lowHighChart").getContext("2d")),
                    window.mylowHighChart && window.mylowHighChart.destroy(),
                    (window.mylowHighChart = new Chart(a, { type: "pie", data: { labels: ["Low", "High"], datasets: [{ backgroundColor: ["#CC5C00", "#007A7A"], data: [n, d] }] }, options: { plugins: { legend: { display: !1 } } } })),
                    (r = j.odd),
                    (o = j.even),
                    (u = document.getElementById("evenOddChart").getContext("2d")),
                    window.myevenOddChart && window.myevenOddChart.destroy(),
                    (window.myevenOddChart = new Chart(u, { type: "pie", data: { labels: ["Odd", "Even"], datasets: [{ backgroundColor: ["#CC5C00", "#007A7A"], data: [r, o] }] }, options: { plugins: { legend: { display: !1 } } } })),
                    (c = M),
                    (b = X),
                    (_ = Y),
                    (m = document.getElementById("dozenChart").getContext("2d")),
                    window.mydozenChart && window.mydozenChart.destroy(),
                    (window.mydozenChart = new Chart(m, {
                        type: "pie",
                        data: { labels: ["1st12", "2nd12", "3rd12"], datasets: [{ backgroundColor: ["#CC5C00", "#007A7A", "#00A300"], data: [c, b, _] }] },
                        options: { plugins: { legend: { display: !1 } } },
                    })),
                    (h = Z),
                    (p = J),
                    (g = K),
                    (f = document.getElementById("columnChart").getContext("2d")),
                    window.mycolumnChart && window.mycolumnChart.destroy(),
                    (window.mycolumnChart = new Chart(f, {
                        type: "pie",
                        data: { labels: ["Col 1", "Col 2", "Col 3"], datasets: [{ backgroundColor: ["#CC5C00", "#007A7A", "#00A300"], data: [h, p, g] }] },
                        options: { plugins: { legend: { display: !1 } } },
                    })),
                    (C = Q),
                    (y = U),
                    (v = V),
                    (S = W),
                    (x = ee),
                    (k = et),
                    (w = es),
                    (D = el),
                    (N = en),
                    (I = ed),
                    (B = ea),
                    (E = ei),
                    (A = document.getElementById("streetChart").getContext("2d")),
                    window.mystreetChart && window.mystreetChart.destroy(),
                    (window.mystreetChart = new Chart(A, {
                        type: "pie",
                        data: {
                            labels: ["St 1", "St 2", "St 3", "St 4", "St 5", "St 6", "St 7", "St 8", "St 9", "St 10", "St 11", "St 12"],
                            datasets: [{ backgroundColor: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"], data: [C, y, v, S, x, k, w, D, N, I, B, E] }],
                        },
                        options: { plugins: { legend: { display: !1 } } },
                    })),
                    (R = er),
                    (z = eo),
                    (P = eu),
                    (O = ec),
                    (H = eb),
                    (T = e_),
                    (F = document.getElementById("doubleStreetChart").getContext("2d")),
                    window.mydoubleStreetChart && window.mydoubleStreetChart.destroy(),
                    (window.mydoubleStreetChart = new Chart(F, {
                        type: "pie",
                        data: {
                            labels: ["Double St 1", "Double St 2", "Double St 3", "Double St 4", "Double St 5", "Double St 6"],
                            datasets: [{ backgroundColor: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c"], data: [R, z, P, O, H, T] }],
                        },
                        options: { plugins: { legend: { display: !1 } } },
                    }));
            })(),
            (function e() {
                var m = null,
                    h = JSON.parse(localStorage.getItem("history")) || [];
                function p(e, t, s) {
                    for (var l = e, n = 0, d = !1, a = 0; a < h.length - (l - 1); a++) {
                        for (var r = !0, o = 0; o < l; o++) {
                            var u = +h[a + o];
                            if (!t.includes(u)) {
                                r = !1;
                                break;
                            }
                        }
                        r ? (d && (n++, (d = !1)), (a += l - 1)) : (d = !0);
                    }
                    if (n > 0)
                        for (
                            !$('#repetitions-table-body tr[data-rep="' + l + '"]').length > 0 &&
                                $("#repetitions-table-body").append(
                                    '<tr data-rep="' +
                                        l +
                                        '"><td> ' +
                                        l +
                                        'x </td><td class="redNumbers leg-int bg-' +
                                        l +
                                        '"></td><td class="blackNumbers leg-int bg-' +
                                        l +
                                        '"></td><td class="evenNumbers leg-int bg-' +
                                        l +
                                        '"></td><td class="oddNumbers leg-int bg-' +
                                        l +
                                        '"></td><td class="oneTo18Numbers leg-int bg-' +
                                        l +
                                        '"></td><td class="nineteenTo36Numbers leg-int bg-' +
                                        l +
                                        '"></td><td class="first12Numbers leg2-int bg-' +
                                        l +
                                        '"></td><td class="second12Numbers leg2-int bg-' +
                                        l +
                                        '"></td><td class="third12Numbers leg2-int bg-' +
                                        l +
                                        '"></td><td class="column1Numbers leg2-int bg-' +
                                        l +
                                        '"></td><td class="column2Numbers leg2-int bg-' +
                                        l +
                                        '"></td><td class="column3Numbers leg2-int bg-' +
                                        l +
                                        '"></td></tr>'
                                ),
                                a = 1;
                            a <= 100;
                            a++
                        )
                            l === a && $('#repetitions-table-body tr[data-rep="' + a + '"] td.' + s).append(n);
                }
                for (console.log(h), h.length > 0 && (m = h[h.length - 1]), $("#repetitions-table-body").empty(), i = 1; i <= 100; i++)
                    p(i, t, "redNumbers"),
                        p(i, s, "blackNumbers"),
                        p(i, b, "evenNumbers"),
                        p(i, _, "oddNumbers"),
                        p(i, u, "oneTo18Numbers"),
                        p(i, c, "nineteenTo36Numbers"),
                        p(i, a, "first12Numbers"),
                        p(i, r, "second12Numbers"),
                        p(i, o, "third12Numbers"),
                        p(i, l, "column1Numbers"),
                        p(i, n, "column2Numbers"),
                        p(i, d, "column3Numbers");
                $("#repetitions-table-body tr td").each(function () {
                    $(this).is(":empty") && $(this).removeClass("bg-1 bg-2 bg-3 bg-4 bg-5 bg-6 bg-7 bg-8 bg-9 bg-10 bg-11 bg-12 bg-13");
                });
            })(),
            (function e() {
                var t = null,
                    s = JSON.parse(localStorage.getItem("history")) || [];
                function l(e, t, l) {
                    for (var n = e, d = 0, a = !1, r = 0; r < s.length - (n - 1); r++) {
                        for (var o = !0, u = 0; u < n; u++) {
                            var c = +s[r + u];
                            if (!t.includes(c)) {
                                o = !1;
                                break;
                            }
                        }
                        o ? (a && (d++, (a = !1)), (r += n - 1)) : (a = !0);
                    }
                    if (d > 0)
                        for (
                            !$('#repetitions-table-body2 tr[data-rep="' + n + '"]').length > 0 &&
                                $("#repetitions-table-body2").append(
                                    '<tr data-rep="' +
                                        n +
                                        '"><td> ' +
                                        n +
                                        'x </td><td class="street1 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street2 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street3 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street4 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street5 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street6 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street7 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street8 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street9 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street10 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street11 leg4-int bg-' +
                                        n +
                                        '"></td><td class="street12 leg4-int bg-' +
                                        n +
                                        '"></td></tr>'
                                ),
                                r = 1;
                            r <= 100;
                            r++
                        )
                            n === r && $('#repetitions-table-body2 tr[data-rep="' + r + '"] td.' + l).append(d);
                }
                for (s.length > 0 && (t = s[s.length - 1]), $("#repetitions-table-body2").empty(), i = 1; i <= 100; i++)
                    l(i, m, "street1"),
                        l(i, h, "street2"),
                        l(i, p, "street3"),
                        l(i, g, "street4"),
                        l(i, f, "street5"),
                        l(i, C, "street6"),
                        l(i, y, "street7"),
                        l(i, v, "street8"),
                        l(i, S, "street9"),
                        l(i, x, "street10"),
                        l(i, k, "street11"),
                        l(i, w, "street12");
                $("#repetitions-table-body2 tr td").each(function () {
                    $(this).is(":empty") && $(this).removeClass("bg-1 bg-2 bg-3 bg-4 bg-5 bg-6 bg-7 bg-8 bg-9 bg-10 bg-11 bg-12 bg-13");
                });
            })(),
            (function e() {
                var t = null,
                    s = JSON.parse(localStorage.getItem("history")) || [];
                function l(e, t, l) {
                    for (var n = e, d = 0, a = !1, r = 0; r < s.length - (n - 1); r++) {
                        for (var o = !0, u = 0; u < n; u++) {
                            var c = +s[r + u];
                            if (!t.includes(c)) {
                                o = !1;
                                break;
                            }
                        }
                        o ? (a && (d++, (a = !1)), (r += n - 1)) : (a = !0);
                    }
                    if (d > 0)
                        for (
                            !$('#repetitions-table-body3 tr[data-rep="' + n + '"]').length > 0 &&
                                $("#repetitions-table-body3").append(
                                    '<tr data-rep="' +
                                        n +
                                        '"><td> ' +
                                        n +
                                        'x </td><td class="doubleStreet1 leg3-int bg-' +
                                        n +
                                        '"></td><td class="doubleStreet2 leg3-int bg-' +
                                        n +
                                        '"></td><td class="doubleStreet3 leg3-int bg-' +
                                        n +
                                        '"></td><td class="doubleStreet4 leg3-int bg-' +
                                        n +
                                        '"></td><td class="doubleStreet5 leg3-int bg-' +
                                        n +
                                        '"></td><td class="doubleStreet6 leg3-int bg-' +
                                        n +
                                        '"></td></tr>'
                                ),
                                r = 1;
                            r <= 100;
                            r++
                        )
                            n === r && $('#repetitions-table-body3 tr[data-rep="' + r + '"] td.' + l).append(d);
                }
                for (s.length > 0 && (t = s[s.length - 1]), $("#repetitions-table-body3").empty(), i = 1; i <= 100; i++)
                    l(i, D, "doubleStreet1"), l(i, N, "doubleStreet2"), l(i, I, "doubleStreet3"), l(i, B, "doubleStreet4"), l(i, E, "doubleStreet5"), l(i, A, "doubleStreet6");
                $("#repetitions-table-body3 tr td").each(function () {
                    $(this).is(":empty") && $(this).removeClass("bg-1 bg-2 bg-3 bg-4 bg-5 bg-6 bg-7 bg-8 bg-9 bg-10 bg-11 bg-12 bg-13");
                });
            })(),
            (R = null),
            (z = null),
            (P = null),
            (O = null),
            (H = null),
            (T = null),
            (F = null),
            (G = 0),
            (L = 0),
            (q = 0),
            (j = 0),
            (M = 0),
            (X = 0),
            (Y = 0),
            (Z = []),
            $("#current-status tbody tr").each(function () {
                Z.push($(this));
            }),
            Z.reverse(),
            $("#current-status tbody").empty(),
            Z.forEach(function (e) {
                var t = e.find("td.color").text();
                t === R || null === R ? G++ : (G = 1), e.find("td.color").html(t + '<span class="reps">(' + G + "x)</span>"), e.find("td.color").addClass("bg-" + G), (R = t);
                var s = e.find("td.even-odd").text();
                s === z || null === z ? L++ : (L = 1), e.find("td.even-odd").html(s + '<span class="reps">(' + L + "x)</span>"), e.find("td.even-odd").addClass("bg-" + L), (z = s);
                var l = e.find("td.low-high").text();
                l === P || null === P ? q++ : (q = 1), e.find("td.low-high").html(l + '<span class="reps">(' + q + "x)</span>"), e.find("td.low-high").addClass("bg-" + q), (P = l);
                var n = e.find("td.dozen").text();
                n === O || null === O ? j++ : (j = 1), e.find("td.dozen").html(n + '<span class="reps">(' + j + "x)</span>"), e.find("td.dozen").addClass("bg-" + j), (O = n);
                var d = e.find("td.column").text();
                d === H || null === H ? M++ : (M = 1), e.find("td.column").html(d + '<span class="reps">(' + M + "x)</span>"), e.find("td.column").addClass("bg-" + M), (H = d);
                var a = e.find("td.street").text();
                a === T || null === T ? X++ : (X = 1), e.find("td.street").html(a + '<span class="reps">(' + X + "x)</span>"), e.find("td.street").addClass("bg-" + X), (T = a);
                var r = e.find("td.doubleStreet").text();
                r === F || null === F ? Y++ : (Y = 1), e.find("td.doubleStreet").html(r + '<span class="reps">(' + Y + "x)</span>"), e.find("td.doubleStreet").addClass("bg-" + Y), (F = r), $("#current-status tbody").prepend(e);
            }),
            (function e() {
                for (var t = JSON.parse(localStorage.getItem("history")) || [], s = $("#numbersRarityTable tbody"), l = [], n = 0, d = 0; d <= 36; d++) {
                    for (var a = -1, r = t.length - 1; r >= 0; r--)
                        if (parseInt(t[r]) === d) {
                            a = t.length - r - 1;
                            break;
                        }
                    l.push({ number: d, spins: a }), (n += a);
                }
                l.sort(function (e, t) {
                    return e.spins - t.spins;
                }),
                    s.empty();
                for (var r = 0; r < l.length; r++) {
                    var o = l[r];
                    s.prepend('<tr class="number-' + o.number + '"><td data-number="' + o.number + '" style="font-size:10px;">Only</td><td style="font-size:10px;">Pro</td></tr>');
                }
            })();
    }
    function z(e, t) {
        var s = document.getElementById("simChart").getContext("2d");
        window.mysimChart && window.mysimChart.destroy(),
            (window.mysimChart = new Chart(s, {
                type: "line",
                data: { labels: Array.from({ length: e }, (e, t) => t + 1), datasets: [{ label: "$", data: t, fill: !0, borderColor: "rgb(255, 255, 255)", backgroundColor: "#003A63", tension: 0.1 }] },
                options: {
                    plugins: { filler: { propagate: !1 }, title: { display: !1, text: (e) => "drawTime: " + e.chart.options.plugins.filler.drawTime } },
                    pointBackgroundColor: "#fff",
                    radius: 2,
                    interaction: { intersect: !1 },
                    scales: { x: { type: "linear", position: "bottom" }, y: { beginAtZero: !0 } },
                },
            }));
    }
    function P() {
        var e, t;
        991 >= $(window).width() &&
            ((t = (e = $("#number-list")).children("li")).sort(function (e, t) {
                return $(e).data("number") - $(t).data("number");
            }),
            e.empty(),
            $.each(t, function (t, s) {
                e.append(s);
            }));
    }
    $(document).on("mouseenter", "#current-status tbody td", function () {
        if (!$('.disable-mouseover input[type="checkbox"]').prop("checked")) {
            for ($("#number-list").addClass("selecting-something"), text = $(this).text(), i = 0; i <= 36; i++) text == i && ($('ul#number-list li[data-number="' + i + '"]').addClass("selected"), $(this).addClass("selected"));
            text.includes("Red") &&
                ($.each(t, function (e, t) {
                    $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                }),
                $(this).addClass("selected")),
                text.includes("Black") &&
                    ($.each(s, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("Green") && ($('ul#number-list li[data-number="0"]').addClass("selected"), $(this).addClass("selected")),
                text.includes("Even") &&
                    ($.each(b, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("Odd") &&
                    ($.each(_, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("Low") &&
                    ($.each(u, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("High") &&
                    ($.each(c, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("1st12") &&
                    ($.each(a, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("2nd12") &&
                    ($.each(r, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("3rd12") &&
                    ($.each(o, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("Col 1") &&
                    ($.each(l, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("Col 2") &&
                    ($.each(n, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("Col 3") &&
                    ($.each(d, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 1 ") &&
                    !text.includes("Double") &&
                    ($.each(m, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 2 ") &&
                    !text.includes("Double") &&
                    ($.each(h, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 3 ") &&
                    !text.includes("Double") &&
                    ($.each(p, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 4 ") &&
                    !text.includes("Double") &&
                    ($.each(g, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 5 ") &&
                    !text.includes("Double") &&
                    ($.each(f, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 6 ") &&
                    !text.includes("Double") &&
                    ($.each(C, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 7 ") &&
                    !text.includes("Double") &&
                    ($.each(y, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 8 ") &&
                    !text.includes("Double") &&
                    ($.each(v, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 9 ") &&
                    !text.includes("Double") &&
                    ($.each(S, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 10 ") &&
                    !text.includes("Double") &&
                    ($.each(x, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 11 ") &&
                    !text.includes("Double") &&
                    ($.each(k, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("St 12 ") &&
                    !text.includes("Double") &&
                    ($.each(w, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("DS 1 ") &&
                    ($.each(D, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("DS 2 ") &&
                    ($.each(N, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("DS 3 ") &&
                    ($.each(I, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("DS 4 ") &&
                    ($.each(B, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("DS 5 ") &&
                    ($.each(E, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected")),
                text.includes("DS 6 ") &&
                    ($.each(A, function (e, t) {
                        $('ul#number-list li[data-number="' + t + '"]').addClass("selected");
                    }),
                    $(this).addClass("selected"));
        }
    }),
        $(document).on("mouseleave", "#current-status tbody td", function () {
            $("#number-list").removeClass("selecting-something"),
                $("ul#number-list li.selected").each(function () {
                    $(this).removeClass("selected");
                }),
                $("#current-status tbody td").each(function () {
                    $(this).removeClass("selected");
                });
        }),
        $("#undo-button").on("click", function () {
            var e = JSON.parse(localStorage.getItem("history")) || [];
            e.length > 0 && (e.pop(), localStorage.setItem("history", JSON.stringify(e)), R()),
                $("#number-list li").each(function () {
                    $(this).removeClass("clicked");
                });
        }),
        $("#clear-history-button").on("click", function () {
            localStorage.removeItem("history"),
                $("#history-list").empty(),
                $("#number-list li").each(function () {
                    $(this).removeClass("clicked");
                }),
                (consecutiveReds = 0),
                R();
        }),
        $(document).on("click tap", "#number-list li", function () {
            $("#number-list li").each(function () {
                $(this).removeClass("clicked");
            }),
                $(this).addClass("clicked");
            var e = $(this).data("number"),
                t = JSON.parse(localStorage.getItem("history")) || [];
            t.push(e), localStorage.setItem("history", JSON.stringify(t)), R();
        }),
        R(),
        document.getElementById("copy-button").addEventListener("click", function () {
            let e = document.querySelectorAll("#history-list li"),
                t = Array.from(e)
                    .map((e) => e.textContent)
                    .reverse()
                    .join("\n"),
                s = document.createElement("textarea");
            (s.value = t), document.body.appendChild(s), s.select(), document.execCommand("copy"), document.body.removeChild(s), alert("Numbers copied to clipboard");
        }),
        $("#number-input").on("input", function () {
            var e = $(this)
                .val()
                .replace(/[^\d\n]/g, "");
            e.length > 1e4 && (e = e.substr(0, 1e4));
            var t = 1e4 - e.length;
            $("#character-count").text("Chars left: " + t), $(this).val(e), t < 0 ? $("#submit-button").prop("disabled", !0) : $("#submit-button").prop("disabled", !1);
        }),
        $("#submit-button").on("click", function () {
            var t = $("#number-input").val().trim().split("\n");
            (t = t
                .map(function (e) {
                    var t = parseInt(e, 10);
                    return !isNaN(t) && t >= 0 && t <= 36 ? t : null;
                })
                .filter(function (e) {
                    return null !== e;
                })
                .slice(0, 1e3)),
                localStorage.setItem("history", JSON.stringify(t)),
                e(),
                $("#number-input").val(""),
                R();
        }),
        $("#generateRandomNumber").on("click", function () {
            var e = JSON.parse(localStorage.getItem("history")) || [];
            e.push(Math.floor(37 * Math.random())), localStorage.setItem("history", JSON.stringify(e)), R();
        }),
        $("#generate100RandomNumbers").mouseenter(function () {
            $(this).text("Pro Feature! Become Pro");
        }),
        $("#generate100RandomNumbers").mouseleave(function () {
            $(this).text("Generate 100 numbers");
        }),
        $("#generate1000RandomNumbers").mouseenter(function () {
            $(this).text("Pro Feature! Become Pro");
        }),
        $("#generate1000RandomNumbers").mouseleave(function () {
            $(this).text("Generate 1000 numbers");
        }),
        $("#generate100RandomNumbers").on("click", function () {
            window.location.href = "https://www.rouletteassistant.com/become-pro/";
        }),
        $("#generate1000RandomNumbers").on("click", function () {
            window.location.href = "https://www.rouletteassistant.com/become-pro/";
        }),
        $("#open-popup-button").mouseenter(function () {
            $(this).text("Pro Feature!");
        }),
        $("#open-popup-button").mouseleave(function () {
            $(this).text("Bulk Add");
        }),
        $("#open-popup-button").on("click", function () {
            window.location.href = "https://www.rouletteassistant.com/become-pro/";
        }),
        P(),
        $(window).on("resize", function () {
            P();
        }),
        $("#bet-switch").on("change", function () {
            let e = $(this).is(":checked");
            e
                ? ($(this).parents(".switch-outer:first").find("span.txt").html('Pro Feature. <a href="/become-pro/">Become Pro!</a>'),
                  (sw = $(this)),
                  setTimeout(function () {
                      sw.prop("checked", !1).change();
                  }, 2e3))
                : $(this).parents(".switch-outer:first").find("span.txt").text("Bet Simulator Mode:");
        }),
        $("[data-tooltip]")
            .on("mousemove", function (e) {
                let t = $(this).data("tooltip"),
                    s = $(".tooltipp");
                s.length || (s = $('<div class="tooltipp"></div>').appendTo("body")), s.css({ color: "#FFF", background: "#000", position: "fixed", top: e.clientY + 20 + "px", left: e.clientX + 10 + "px", zIndex: 9999 }).text(t);
            })
            .on("mouseout", function () {
                $(".tooltipp").remove();
            });
});
