const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'output-v4');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const screenshots = [
  { id:1, caption:'Track Every Dollar\nEffortlessly', gradient:'linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)', screen:'dashboard' },
  { id:2, caption:'See Where Your\nMoney Goes', gradient:'linear-gradient(145deg, #0f3460 0%, #1a1a4e 50%, #2d1b69 100%)', screen:'categories' },
  { id:3, caption:'Add Expenses\nin 3 Seconds', gradient:'linear-gradient(145deg, #1b2838 0%, #172a3a 50%, #1a3a4a 100%)', screen:'add-expense' },
  { id:4, caption:'Spot Spending\nTrends Early', gradient:'linear-gradient(145deg, #1a0a2e 0%, #2d1b69 50%, #1a1a4e 100%)', screen:'trends' },
  { id:5, caption:'Stay Under\nBudget', gradient:'linear-gradient(145deg, #0a1628 0%, #0f3460 50%, #0a2647 100%)', screen:'budget' },
  { id:6, caption:'Your Data Stays\nOn Your Device', gradient:'linear-gradient(145deg, #1a1a2e 0%, #0d1b2a 50%, #1b2838 100%)', screen:'privacy' },
  { id:7, caption:'Gorgeous\nDark Mode', gradient:'linear-gradient(145deg, #0a0a0f 0%, #1a1a2e 50%, #0d0d1a 100%)', screen:'darkmode' },
  { id:8, caption:'Expense Tracking\nDone Right', gradient:'linear-gradient(145deg, #16213e 0%, #1a1a4e 50%, #0f3460 100%)', screen:'overview' },
];

function appScreen(screen) {
  // All screens use padding-top:52px to clear the notch/status bar area
  const s = {
    dashboard: `
      <div style="background:#111827;color:#fff;width:100%;height:100%;font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;">
        <div style="padding:52px 18px 0;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:13px;color:#9ca3af;">Good morning</div>
            <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#6366f1);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">A</div>
          </div>
          <div style="font-size:20px;font-weight:800;margin:2px 0 12px;">February 2026</div>
        </div>
        <div style="margin:0 14px 10px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:18px;padding:18px;">
          <div style="font-size:11px;color:rgba(255,255,255,0.7);">Total Spent This Month</div>
          <div style="font-size:34px;font-weight:800;letter-spacing:-1px;margin:2px 0;">$2,847.50</div>
          <div style="display:flex;gap:6px;margin-top:6px;align-items:center;">
            <div style="background:rgba(52,211,153,0.2);color:#34d399;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;">↓ 12% vs last month</div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:14px;">
            <div><div style="font-size:9px;color:rgba(255,255,255,0.6);">Daily Avg</div><div style="font-size:16px;font-weight:700;">$149</div></div>
            <div><div style="font-size:9px;color:rgba(255,255,255,0.6);">Budget Left</div><div style="font-size:16px;font-weight:700;color:#34d399;">$1,152</div></div>
            <div><div style="font-size:9px;color:rgba(255,255,255,0.6);">Saved</div><div style="font-size:16px;font-weight:700;color:#34d399;">$340</div></div>
          </div>
        </div>
        <div style="padding:0 14px;flex:1;overflow:hidden;">
          <div style="font-size:13px;font-weight:700;margin-bottom:6px;">Recent</div>
          ${[
            {icon:'🛒',name:'Whole Foods',cat:'Groceries',amt:'-$67.42',time:'2h ago',color:'#34d399'},
            {icon:'⛽',name:'Shell Gas',cat:'Transport',amt:'-$48.50',time:'5h ago',color:'#f59e0b'},
            {icon:'🍕',name:'DoorDash',cat:'Dining',amt:'-$32.18',time:'Yesterday',color:'#f472b6'},
            {icon:'💡',name:'Electric Bill',cat:'Utilities',amt:'-$124.00',time:'Yesterday',color:'#60a5fa'},
            {icon:'🎬',name:'Netflix',cat:'Entertainment',amt:'-$15.99',time:'Feb 15',color:'#a78bfa'},
            {icon:'🏋️',name:'Planet Fitness',cat:'Health',amt:'-$24.99',time:'Feb 14',color:'#fb923c'},
            {icon:'☕',name:'Starbucks',cat:'Dining',amt:'-$6.75',time:'Feb 14',color:'#f472b6'},
            {icon:'🎵',name:'Spotify',cat:'Subs',amt:'-$10.99',time:'Feb 13',color:'#22d3ee'},
            {icon:'🛍️',name:'Amazon',cat:'Shopping',amt:'-$43.27',time:'Feb 12',color:'#e879f9'},
            {icon:'💊',name:'CVS Pharmacy',cat:'Health',amt:'-$18.50',time:'Feb 12',color:'#fb923c'},
          ].map(t => `
            <div style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <div style="width:34px;height:34px;border-radius:10px;background:${t.color}18;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;">${t.icon}</div>
              <div style="flex:1;margin-left:10px;min-width:0;">
                <div style="font-size:13px;font-weight:600;">${t.name}</div>
                <div style="font-size:10px;color:#6b7280;">${t.cat} · ${t.time}</div>
              </div>
              <div style="font-size:13px;font-weight:700;">${t.amt}</div>
            </div>
          `).join('')}
        </div>
        <div style="height:56px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-around;padding:0 20px;flex-shrink:0;">
          <span style="font-size:20px;opacity:1;">🏠</span>
          <span style="font-size:20px;opacity:0.4;">📊</span>
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#6366f1);display:flex;align-items:center;justify-content:center;font-size:22px;margin-top:-14px;box-shadow:0 4px 12px rgba(124,58,237,0.4);">+</div>
          <span style="font-size:20px;opacity:0.4;">📈</span>
          <span style="font-size:20px;opacity:0.4;">⚙️</span>
        </div>
      </div>`,

    categories: `
      <div style="background:#111827;color:#fff;width:100%;height:100%;font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;padding:52px 14px 0;">
        <div style="font-size:20px;font-weight:800;margin-bottom:14px;">Categories</div>
        <div style="position:relative;width:180px;height:180px;margin:0 auto 14px;">
          <svg viewBox="0 0 200 200" width="180" height="180">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#34d399" stroke-width="28" stroke-dasharray="175 503" stroke-dashoffset="0" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" stroke-width="28" stroke-dasharray="126 503" stroke-dashoffset="-175" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="#f472b6" stroke-width="28" stroke-dasharray="90 503" stroke-dashoffset="-301" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="#60a5fa" stroke-width="28" stroke-dasharray="55 503" stroke-dashoffset="-391" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="#a78bfa" stroke-width="28" stroke-dasharray="35 503" stroke-dashoffset="-446" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="#fb923c" stroke-width="28" stroke-dasharray="22 503" stroke-dashoffset="-481" transform="rotate(-90 100 100)"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
            <div style="font-size:22px;font-weight:800;">$2,847</div>
            <div style="font-size:10px;color:#9ca3af;">Total</div>
          </div>
        </div>
        <div style="flex:1;overflow:hidden;">
        ${[
          {icon:'🛒',name:'Groceries',amt:'$847',pct:'29.7%',color:'#34d399',bar:29.7},
          {icon:'⛽',name:'Transport',amt:'$612',pct:'21.5%',color:'#f59e0b',bar:21.5},
          {icon:'🍕',name:'Dining Out',amt:'$438',pct:'15.4%',color:'#f472b6',bar:15.4},
          {icon:'💡',name:'Utilities',amt:'$267',pct:'9.4%',color:'#60a5fa',bar:9.4},
          {icon:'👕',name:'Shopping',amt:'$198',pct:'7.0%',color:'#e879f9',bar:7.0},
          {icon:'🎬',name:'Entertainment',amt:'$178',pct:'6.3%',color:'#a78bfa',bar:6.3},
          {icon:'🏋️',name:'Health',amt:'$156',pct:'5.5%',color:'#fb923c',bar:5.5},
          {icon:'📱',name:'Subscriptions',amt:'$150',pct:'5.3%',color:'#22d3ee',bar:5.3},
        ].map(c => `
          <div style="display:flex;align-items:center;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <div style="width:32px;height:32px;border-radius:9px;background:${c.color}18;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">${c.icon}</div>
            <div style="flex:1;margin-left:8px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                <span style="font-size:12px;font-weight:600;">${c.name}</span>
                <span style="font-size:12px;font-weight:700;">${c.amt}</span>
              </div>
              <div style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;">
                <div style="height:100%;width:${c.bar*2.5}%;background:${c.color};border-radius:2px;"></div>
              </div>
            </div>
            <div style="font-size:10px;color:#9ca3af;margin-left:6px;width:34px;text-align:right;">${c.pct}</div>
          </div>
        `).join('')}
        </div>
        <div style="padding:10px 0 12px;">
          <div style="background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.2);border-radius:12px;padding:12px 14px;display:flex;align-items:center;">
            <span style="font-size:16px;margin-right:8px;">💡</span>
            <div style="font-size:11px;color:#c4b5fd;line-height:1.4;"><strong style="color:#a78bfa;">Tip:</strong> Your dining spending dropped 22% this month. Keep it up!</div>
          </div>
        </div>
      </div>`,

    'add-expense': `
      <div style="background:#111827;color:#fff;width:100%;height:100%;font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;padding:52px 14px 0;">
        <div style="font-size:20px;font-weight:800;margin-bottom:20px;">Add Expense</div>
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:11px;color:#9ca3af;margin-bottom:6px;">Amount</div>
          <div style="font-size:52px;font-weight:800;letter-spacing:-2px;">$42<span style="color:#7c3aed;">.50</span></div>
        </div>
        <div style="margin-bottom:16px;">
          <div style="font-size:12px;color:#9ca3af;margin-bottom:8px;">Quick Categories</div>
          <div style="display:flex;flex-wrap:wrap;gap:7px;">
            ${['🛒 Groceries','🍕 Dining','⛽ Gas','☕ Coffee','💊 Health','🎬 Fun','👕 Shopping','📱 Bills','🏠 Rent','✈️ Travel','🎁 Gifts','💇 Self Care'].map((c,i) => `
              <div style="padding:7px 12px;border-radius:10px;font-size:12px;font-weight:500;${i===1?'background:#7c3aed;color:white;':'background:rgba(255,255,255,0.07);color:#d1d5db;'}">${c}</div>
            `).join('')}
          </div>
        </div>
        <div style="margin-bottom:12px;">
          <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;">Note</div>
          <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:12px 14px;color:#9ca3af;font-size:13px;">Lunch with Sarah...</div>
        </div>
        <div style="margin-bottom:12px;">
          <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;">Date</div>
          <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:12px 14px;color:#fff;font-size:13px;font-weight:500;">Today, Feb 19</div>
        </div>
        <div style="margin-bottom:12px;">
          <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;">Recent</div>
          <div style="display:flex;gap:6px;">
            ${['Whole Foods','Starbucks','Shell Gas'].map(r => `<div style="padding:6px 10px;border-radius:8px;background:rgba(255,255,255,0.05);font-size:11px;color:#9ca3af;">${r}</div>`).join('')}
          </div>
        </div>
        <div style="margin-top:auto;padding-bottom:16px;">
          <div style="background:linear-gradient(135deg,#7c3aed,#6366f1);border-radius:14px;padding:16px;text-align:center;font-size:15px;font-weight:700;">Save Expense</div>
        </div>
      </div>`,

    trends: `
      <div style="background:#111827;color:#fff;width:100%;height:100%;font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;padding:52px 14px 0;">
        <div style="font-size:20px;font-weight:800;margin-bottom:2px;">Monthly Trends</div>
        <div style="font-size:11px;color:#9ca3af;margin-bottom:14px;">Last 6 months</div>
        <div style="background:rgba(255,255,255,0.03);border-radius:14px;padding:16px;margin-bottom:12px;">
          <svg viewBox="0 0 340 160" width="100%" style="display:block;">
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
              </linearGradient>
            </defs>
            ${[0,1,2,3].map(i => `<line x1="10" y1="${10+i*40}" x2="340" y2="${10+i*40}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`).join('')}
            <path d="M20,80 L84,90 L148,60 L212,75 L276,40 L340,30" fill="none" stroke="#7c3aed" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20,80 L84,90 L148,60 L212,75 L276,40 L340,30 L340,130 L20,130 Z" fill="url(#ag)"/>
            ${[{x:20,y:80,v:'$3.1k'},{x:84,y:90,v:'$3.5k'},{x:148,y:60,v:'$2.4k'},{x:212,y:75,v:'$2.9k'},{x:276,y:40,v:'$2.6k'},{x:340,y:30,v:'$2.8k'}].map(p => `
              <circle cx="${p.x}" cy="${p.y}" r="4" fill="#7c3aed" stroke="#111827" stroke-width="2"/>
              <text x="${p.x}" y="${p.y-10}" fill="#9ca3af" font-size="9" text-anchor="middle" font-family="Inter,sans-serif">${p.v}</text>
            `).join('')}
            ${['Sep','Oct','Nov','Dec','Jan','Feb'].map((m,i) => `<text x="${20+i*64}" y="150" fill="#6b7280" font-size="10" text-anchor="middle" font-family="Inter,sans-serif">${m}</text>`).join('')}
          </svg>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <div style="flex:1;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.15);border-radius:12px;padding:12px;">
            <div style="font-size:10px;color:#34d399;margin-bottom:2px;">Best Month</div>
            <div style="font-size:18px;font-weight:800;">$2,410</div>
            <div style="font-size:10px;color:#6b7280;">November</div>
          </div>
          <div style="flex:1;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.15);border-radius:12px;padding:12px;">
            <div style="font-size:10px;color:#f87171;margin-bottom:2px;">Highest</div>
            <div style="font-size:18px;font-weight:800;">$3,520</div>
            <div style="font-size:10px;color:#6b7280;">October</div>
          </div>
          <div style="flex:1;background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.15);border-radius:12px;padding:12px;">
            <div style="font-size:10px;color:#a78bfa;margin-bottom:2px;">Average</div>
            <div style="font-size:18px;font-weight:800;">$2,883</div>
            <div style="font-size:10px;color:#6b7280;">6-month</div>
          </div>
        </div>
        <div style="font-size:13px;font-weight:700;margin-bottom:8px;">Insights</div>
        ${[
          {icon:'📉',text:'Spending dropped 12% this month',color:'#34d399'},
          {icon:'🍕',text:'Dining out down $120 vs last month',color:'#34d399'},
          {icon:'⚡',text:'Utilities up $18 — seasonal increase',color:'#f59e0b'},
          {icon:'🎯',text:'On track to save $400 this month',color:'#7c3aed'},
          {icon:'🔥',text:'3-month spending streak declining!',color:'#34d399'},
        ].map(i => `
          <div style="display:flex;align-items:center;padding:9px 10px;background:rgba(255,255,255,0.03);border-radius:10px;margin-bottom:6px;">
            <span style="font-size:15px;margin-right:8px;">${i.icon}</span>
            <span style="font-size:12px;color:${i.color};font-weight:500;">${i.text}</span>
          </div>
        `).join('')}
        <div style="margin-top:auto;padding:10px 0;">
          <div style="font-size:13px;font-weight:700;margin-bottom:8px;">Category Comparison</div>
          <div style="display:flex;gap:6px;">
            ${[{name:'Groceries',pct:'-8%',c:'#34d399'},{name:'Dining',pct:'-22%',c:'#34d399'},{name:'Transport',pct:'+5%',c:'#f87171'},{name:'Bills',pct:'0%',c:'#6b7280'}].map(x => `
              <div style="flex:1;background:rgba(255,255,255,0.03);border-radius:8px;padding:8px;text-align:center;">
                <div style="font-size:10px;color:#9ca3af;">${x.name}</div>
                <div style="font-size:13px;font-weight:700;color:${x.c};">${x.pct}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`,

    budget: `
      <div style="background:#111827;color:#fff;width:100%;height:100%;font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;padding:52px 14px 0;">
        <div style="font-size:20px;font-weight:800;margin-bottom:2px;">Budget</div>
        <div style="font-size:11px;color:#9ca3af;margin-bottom:14px;">February 2026</div>
        <div style="background:linear-gradient(135deg,rgba(52,211,153,0.12),rgba(52,211,153,0.04));border:1px solid rgba(52,211,153,0.15);border-radius:14px;padding:16px;margin-bottom:14px;text-align:center;">
          <div style="font-size:11px;color:#34d399;margin-bottom:2px;">Under Budget 🎉</div>
          <div style="font-size:32px;font-weight:800;color:#34d399;">$1,152.50</div>
          <div style="font-size:10px;color:#9ca3af;margin-top:2px;">remaining of $4,000</div>
          <div style="height:8px;background:rgba(255,255,255,0.08);border-radius:4px;margin-top:10px;">
            <div style="height:100%;width:71%;background:linear-gradient(90deg,#34d399,#22d3ee);border-radius:4px;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:#6b7280;">
            <span>$2,847 spent</span><span>$4,000 budget</span>
          </div>
        </div>
        <div style="flex:1;overflow:hidden;">
        ${[
          {name:'Groceries',spent:847,budget:900,color:'#34d399',icon:'🛒'},
          {name:'Dining Out',spent:438,budget:500,color:'#34d399',icon:'🍕'},
          {name:'Transport',spent:612,budget:600,color:'#f87171',icon:'⛽'},
          {name:'Entertainment',spent:178,budget:250,color:'#34d399',icon:'🎬'},
          {name:'Utilities',spent:267,budget:300,color:'#f59e0b',icon:'💡'},
          {name:'Shopping',spent:198,budget:300,color:'#34d399',icon:'👕'},
          {name:'Subscriptions',spent:150,budget:150,color:'#f59e0b',icon:'📱'},
          {name:'Health',spent:156,budget:200,color:'#34d399',icon:'🏋️'},
          {name:'Savings',spent:340,budget:500,color:'#34d399',icon:'🏦'},
        ].map(b => {
          const pct = Math.min((b.spent/b.budget)*100,100);
          const clr = b.spent>b.budget?'#f87171':b.spent>b.budget*0.9?'#f59e0b':'#34d399';
          return `
          <div style="margin-bottom:11px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <div style="display:flex;align-items:center;gap:5px;">
                <span style="font-size:13px;">${b.icon}</span>
                <span style="font-size:12px;font-weight:600;">${b.name}</span>
              </div>
              <span style="font-size:12px;font-weight:600;">$${b.spent} <span style="color:#6b7280;font-weight:400;font-size:10px;">/ $${b.budget}</span></span>
            </div>
            <div style="height:5px;background:rgba(255,255,255,0.06);border-radius:3px;">
              <div style="height:100%;width:${pct}%;background:${clr};border-radius:3px;"></div>
            </div>
          </div>`;
        }).join('')}
        </div>
        <div style="padding:8px 0 12px;">
          <div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.12);border-radius:10px;padding:10px 12px;display:flex;align-items:center;">
            <span style="font-size:14px;margin-right:8px;">🎯</span>
            <div style="font-size:11px;color:#34d399;line-height:1.3;">12 days left this month — you're on pace to finish $200 under budget!</div>
          </div>
        </div>
      </div>`,

    privacy: `
      <div style="background:#111827;color:#fff;width:100%;height:100%;font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;padding:52px 14px 0;">
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <div style="width:80px;height:80px;border-radius:24px;background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(99,102,241,0.1));display:flex;align-items:center;justify-content:center;font-size:40px;margin-bottom:16px;">🔒</div>
          <div style="font-size:22px;font-weight:800;margin-bottom:6px;text-align:center;">Your Data Stays<br>On Your Device</div>
          <div style="font-size:12px;color:#9ca3af;text-align:center;line-height:1.5;margin-bottom:24px;max-width:260px;">SpendBot stores everything locally. No cloud, no tracking, no data collection. Period.</div>
          ${[
            {icon:'📱',title:'100% On-Device',desc:'All data stored locally on your phone'},
            {icon:'🚫',title:'Zero Tracking',desc:'No analytics, no telemetry, nothing'},
            {icon:'🔐',title:'Encrypted Storage',desc:'AES-256 encryption at rest'},
            {icon:'👻',title:'No Account Needed',desc:'Use instantly — no sign-up required'},
            {icon:'🗑️',title:'Easy Data Export',desc:'Export or delete everything, anytime'},
            {icon:'✅',title:'No Permissions',desc:'No contacts, camera, or location access'},
          ].map(f => `
            <div style="display:flex;align-items:flex-start;width:100%;padding:11px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.04);border-radius:12px;margin-bottom:7px;">
              <span style="font-size:20px;margin-right:12px;flex-shrink:0;">${f.icon}</span>
              <div>
                <div style="font-size:13px;font-weight:700;">${f.title}</div>
                <div style="font-size:11px;color:#9ca3af;margin-top:1px;">${f.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`,

    darkmode: `
      <div style="background:#09090b;color:#fff;width:100%;height:100%;font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;">
        <div style="padding:52px 14px 0;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:12px;color:#52525b;">Good evening</div>
              <div style="font-size:20px;font-weight:800;">February 2026</div>
            </div>
            <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#6366f1);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">A</div>
          </div>
        </div>
        <div style="margin:12px 14px 10px;background:linear-gradient(135deg,#18181b,#27272a);border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:18px;">
          <div style="font-size:11px;color:#71717a;">Total Spent</div>
          <div style="font-size:34px;font-weight:800;letter-spacing:-1px;margin:2px 0;">$2,847.50</div>
          <div style="display:flex;gap:6px;margin-top:6px;">
            <div style="background:rgba(52,211,153,0.12);color:#34d399;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;">↓ 12%</div>
            <div style="color:#52525b;font-size:10px;padding:2px 0;">vs last month</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;margin:0 14px 10px;">
          <div style="flex:1;background:#18181b;border:1px solid rgba(255,255,255,0.04);border-radius:12px;padding:12px;">
            <div style="font-size:9px;color:#52525b;">Budget Left</div>
            <div style="font-size:18px;font-weight:800;color:#34d399;">$1,152</div>
          </div>
          <div style="flex:1;background:#18181b;border:1px solid rgba(255,255,255,0.04);border-radius:12px;padding:12px;">
            <div style="font-size:9px;color:#52525b;">Saved</div>
            <div style="font-size:18px;font-weight:800;color:#22d3ee;">$340</div>
          </div>
          <div style="flex:1;background:#18181b;border:1px solid rgba(255,255,255,0.04);border-radius:12px;padding:12px;">
            <div style="font-size:9px;color:#52525b;">Daily Avg</div>
            <div style="font-size:18px;font-weight:800;">$149</div>
          </div>
        </div>
        <div style="padding:0 14px;flex:1;overflow:hidden;">
          <div style="font-size:13px;font-weight:700;margin-bottom:6px;">Today</div>
          ${[
            {icon:'🛒',name:'Whole Foods',amt:'-$67.42',time:'2h ago'},
            {icon:'☕',name:'Blue Bottle',amt:'-$5.75',time:'4h ago'},
            {icon:'⛽',name:'Shell Gas',amt:'-$48.50',time:'6h ago'},
          ].map(t => `
            <div style="display:flex;align-items:center;padding:10px 12px;background:#18181b;border:1px solid rgba(255,255,255,0.03);border-radius:10px;margin-bottom:5px;">
              <span style="font-size:16px;margin-right:8px;">${t.icon}</span>
              <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${t.name}</div><div style="font-size:10px;color:#3f3f46;">${t.time}</div></div>
              <div style="font-size:13px;font-weight:700;">${t.amt}</div>
            </div>
          `).join('')}
          <div style="font-size:13px;font-weight:700;margin:8px 0 6px;">Yesterday</div>
          ${[
            {icon:'🍕',name:'DoorDash',amt:'-$32.18',time:'12:30 PM'},
            {icon:'💡',name:'Electric Bill',amt:'-$124.00',time:'Auto-pay'},
            {icon:'🎬',name:'Netflix',amt:'-$15.99',time:'Monthly'},
            {icon:'🏋️',name:'Planet Fitness',amt:'-$24.99',time:'Monthly'},
          ].map(t => `
            <div style="display:flex;align-items:center;padding:10px 12px;background:#18181b;border:1px solid rgba(255,255,255,0.03);border-radius:10px;margin-bottom:5px;">
              <span style="font-size:16px;margin-right:8px;">${t.icon}</span>
              <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${t.name}</div><div style="font-size:10px;color:#3f3f46;">${t.time}</div></div>
              <div style="font-size:13px;font-weight:700;">${t.amt}</div>
            </div>
          `).join('')}
        </div>
        <div style="height:50px;border-top:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:space-around;padding:0 20px;flex-shrink:0;">
          <span style="font-size:18px;opacity:1;">🏠</span>
          <span style="font-size:18px;opacity:0.3;">📊</span>
          <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#6366f1);display:flex;align-items:center;justify-content:center;font-size:20px;margin-top:-12px;box-shadow:0 4px 12px rgba(124,58,237,0.4);">+</div>
          <span style="font-size:18px;opacity:0.3;">📈</span>
          <span style="font-size:18px;opacity:0.3;">⚙️</span>
        </div>
      </div>`,

    overview: `
      <div style="background:#111827;color:#fff;width:100%;height:100%;font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;padding:52px 14px 0;">
        <div style="text-align:center;margin-bottom:14px;">
          <div style="font-size:24px;margin-bottom:2px;">🤖</div>
          <div style="font-size:18px;font-weight:800;">SpendBot</div>
          <div style="font-size:11px;color:#9ca3af;">Everything you need. Nothing you don't.</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;flex:1;">
          ${[
            {icon:'📊',title:'Dashboard',desc:'Full spending overview at a glance',color:'#7c3aed'},
            {icon:'📂',title:'Categories',desc:'Auto-organized with smart labels',color:'#34d399'},
            {icon:'📈',title:'Trends',desc:'6-month insights & patterns',color:'#f59e0b'},
            {icon:'🎯',title:'Budgets',desc:'Set goals, stay on track',color:'#f472b6'},
            {icon:'⚡',title:'Quick Add',desc:'3-second expense entry',color:'#60a5fa'},
            {icon:'🔒',title:'Private',desc:'100% on-device storage',color:'#a78bfa'},
            {icon:'🌙',title:'Dark Mode',desc:'Gorgeous OLED-friendly UI',color:'#6366f1'},
            {icon:'🔔',title:'Smart Alerts',desc:'Budget warnings & insights',color:'#fb923c'},
          ].map(f => `
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:14px;padding:14px;display:flex;flex-direction:column;">
              <div style="width:36px;height:36px;border-radius:10px;background:${f.color}18;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:6px;">${f.icon}</div>
              <div style="font-size:13px;font-weight:700;">${f.title}</div>
              <div style="font-size:10px;color:#9ca3af;margin-top:2px;line-height:1.3;">${f.desc}</div>
            </div>
          `).join('')}
        </div>
        <div style="padding:10px 0 14px;">
          <div style="background:linear-gradient(135deg,#7c3aed,#6366f1);border-radius:14px;padding:14px;text-align:center;">
            <div style="font-size:15px;font-weight:700;">$4.99 · Lifetime Access</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:3px;">No subscriptions. No upsells. Ever.</div>
          </div>
        </div>
      </div>`
  };
  return s[screen] || s.dashboard;
}

function compositorHTML(shot) {
  // Phone takes ~75% of canvas height = ~1440px. Canvas = 1080×1920
  const phoneW = 740;  // wide phone
  const phoneH = 1440; // tall phone  
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{width:1080px;height:1920px;background:${shot.gradient};display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Inter',sans-serif;overflow:hidden;position:relative;}
  body::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 25% 15%,rgba(124,58,237,0.18) 0%,transparent 55%),radial-gradient(ellipse at 75% 85%,rgba(99,102,241,0.12) 0%,transparent 55%),radial-gradient(ellipse at 50% 50%,rgba(34,211,153,0.04) 0%,transparent 40%);}
  body::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 80% 20%,rgba(255,255,255,0.03) 0%,transparent 30%);}
  .caption{font-size:48px;font-weight:900;color:white;text-align:center;letter-spacing:-1.5px;margin-bottom:36px;z-index:1;text-shadow:0 2px 24px rgba(0,0,0,0.4);line-height:1.08;max-width:800px;white-space:pre-line;}
  .phone{width:${phoneW}px;height:${phoneH}px;background:linear-gradient(145deg,#2a2a2a,#1a1a1a);border-radius:48px;padding:10px;box-shadow:0 0 0 1.5px rgba(255,255,255,0.08),0 30px 90px rgba(0,0,0,0.5),0 10px 30px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.08);position:relative;z-index:1;}
  .screen{width:100%;height:100%;border-radius:40px;overflow:hidden;background:#111827;position:relative;}
  .notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:140px;height:30px;background:#1a1a1a;border-radius:0 0 18px 18px;z-index:10;}
  .notch::before{content:'';position:absolute;top:10px;left:50%;transform:translateX(-50%);width:8px;height:8px;border-radius:50%;background:#333;}
  .status{position:absolute;top:2px;left:0;right:0;height:30px;display:flex;justify-content:space-between;align-items:center;padding:0 22px;z-index:11;font-size:12px;font-weight:600;color:white;}
  .content{position:absolute;inset:0;overflow:hidden;}
</style></head>
<body>
  <div class="caption">${shot.caption}</div>
  <div class="phone">
    <div class="screen">
      <div class="notch"></div>
      <div class="status"><span>9:41</span><span style="display:flex;gap:4px;font-size:11px;">5G ▂▄▆█ 🔋</span></div>
      <div class="content">${appScreen(shot.screen)}</div>
    </div>
  </div>
</body></html>`;
}

async function main() {
  console.log('🎨 Generating premium v4 screenshots...');
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'],headless:true});

  for (const shot of screenshots) {
    console.log(`  📸 ${shot.id}. ${shot.caption.replace(/\n/g,' ')}...`);
    const page = await browser.newPage();
    await page.setViewport({width:1080,height:1920,deviceScaleFactor:1});
    await page.setContent(compositorHTML(shot),{waitUntil:'networkidle0',timeout:15000});
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 500));
    const out = path.join(OUTPUT_DIR, `screenshot-${shot.id}.png`);
    await page.screenshot({path:out,type:'png'});
    const sz = fs.statSync(out);
    console.log(`    ✅ ${(sz.size/1024).toFixed(0)}KB`);
    await page.close();
  }
  await browser.close();
  console.log('\n🎉 All 8 screenshots generated!');
}
main().catch(e=>{console.error(e);process.exit(1);});
