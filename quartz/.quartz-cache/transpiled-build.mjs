var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import sourceMapSupport from"source-map-support";import path11 from"path";import pretty from"pretty-time";import{styleText}from"util";var PerfTimer=class{static{__name(this,"PerfTimer")}evts;constructor(){this.evts={},this.addEvent("start")}addEvent(evtName){this.evts[evtName]=process.hrtime()}timeSince(evtName){return styleText("yellow",pretty(process.hrtime(this.evts[evtName??"start"])))}};import{rm}from"fs/promises";import{isGitIgnored}from"globby";import{styleText as styleText8}from"util";import esbuild from"esbuild";import remarkParse from"remark-parse";import remarkRehype from"remark-rehype";import{unified}from"unified";import{read}from"to-vfile";import{slug as slugAnchor}from"github-slugger";import rfdc from"rfdc";var clone=rfdc();var QUARTZ="quartz";function isRelativeURL(s){let validStart=/^\.{1,2}/.test(s),validEnding=!endsWith(s,"index");return validStart&&validEnding&&![".md",".html"].includes(getFileExtension(s)??"")}__name(isRelativeURL,"isRelativeURL");function sluggify(s){return s.split("/").map(segment=>segment.replace(/\s/g,"-").replace(/&/g,"-and-").replace(/%/g,"-percent").replace(/\?/g,"").replace(/#/g,"")).join("/").replace(/\/$/,"")}__name(sluggify,"sluggify");function slugifyFilePath(fp,excludeExt){fp=stripSlashes(fp);let ext=getFileExtension(fp),withoutFileExt=fp.replace(new RegExp(ext+"$"),"");(excludeExt||[".md",".html",void 0].includes(ext))&&(ext="");let slug=sluggify(withoutFileExt);return endsWith(slug,"_index")&&(slug=slug.replace(/_index$/,"index")),slug+ext}__name(slugifyFilePath,"slugifyFilePath");function simplifySlug(fp){let res=stripSlashes(trimSuffix(fp,"index"),!0);return res.length===0?"/":res}__name(simplifySlug,"simplifySlug");function transformInternalLink(link){let[fplike,anchor]=splitAnchor(decodeURI(link)),folderPath=isFolderPath(fplike),segments=fplike.split("/").filter(x=>x.length>0),prefix=segments.filter(isRelativeSegment).join("/"),fp=segments.filter(seg=>!isRelativeSegment(seg)&&seg!=="").join("/"),simpleSlug=simplifySlug(slugifyFilePath(fp)),joined=joinSegments(stripSlashes(prefix),stripSlashes(simpleSlug)),trail=folderPath?"/":"";return _addRelativeToStart(joined)+trail+anchor}__name(transformInternalLink,"transformInternalLink");var _rebaseHastElement=__name((el,attr,curBase,newBase)=>{if(el.properties?.[attr]){if(!isRelativeURL(String(el.properties[attr])))return;let rel=joinSegments(resolveRelative(curBase,newBase),"..",el.properties[attr]);el.properties[attr]=rel}},"_rebaseHastElement");function normalizeHastElement(rawEl,curBase,newBase){let el=clone(rawEl);return _rebaseHastElement(el,"src",curBase,newBase),_rebaseHastElement(el,"href",curBase,newBase),el.children&&(el.children=el.children.map(child=>normalizeHastElement(child,curBase,newBase))),el}__name(normalizeHastElement,"normalizeHastElement");function pathToRoot(slug){let rootPath=slug.split("/").filter(x=>x!=="").slice(0,-1).map(_=>"..").join("/");return rootPath.length===0&&(rootPath="."),rootPath}__name(pathToRoot,"pathToRoot");function resolveRelative(current,target){return joinSegments(pathToRoot(current),simplifySlug(target))}__name(resolveRelative,"resolveRelative");function splitAnchor(link){let[fp,anchor]=link.split("#",2);return fp.endsWith(".pdf")?[fp,anchor===void 0?"":`#${anchor}`]:(anchor=anchor===void 0?"":"#"+slugAnchor(anchor),[fp,anchor])}__name(splitAnchor,"splitAnchor");function slugTag(tag){return tag.split("/").map(tagSegment=>sluggify(tagSegment)).join("/")}__name(slugTag,"slugTag");function joinSegments(...args){if(args.length===0)return"";let joined=args.filter(segment=>segment!==""&&segment!=="/").map(segment=>stripSlashes(segment)).join("/");return args[0].startsWith("/")&&(joined="/"+joined),args[args.length-1].endsWith("/")&&(joined=joined+"/"),joined}__name(joinSegments,"joinSegments");function getAllSegmentPrefixes(tags){let segments=tags.split("/"),results=[];for(let i=0;i<segments.length;i++)results.push(segments.slice(0,i+1).join("/"));return results}__name(getAllSegmentPrefixes,"getAllSegmentPrefixes");function transformLink(src,target,opts){let targetSlug=transformInternalLink(target);if(opts.strategy==="relative")return targetSlug;{let folderTail=isFolderPath(targetSlug)?"/":"",canonicalSlug=stripSlashes(targetSlug.slice(1)),[targetCanonical,targetAnchor]=splitAnchor(canonicalSlug);if(opts.strategy==="shortest"){let matchingFileNames=opts.allSlugs.filter(slug=>{let fileName=slug.split("/").at(-1);return targetCanonical===fileName});if(matchingFileNames.length===1){let targetSlug2=matchingFileNames[0];return resolveRelative(src,targetSlug2)+targetAnchor}}return joinSegments(pathToRoot(src),canonicalSlug)+folderTail}}__name(transformLink,"transformLink");function isFolderPath(fplike){return fplike.endsWith("/")||endsWith(fplike,"index")||endsWith(fplike,"index.md")||endsWith(fplike,"index.html")}__name(isFolderPath,"isFolderPath");function endsWith(s,suffix){return s===suffix||s.endsWith("/"+suffix)}__name(endsWith,"endsWith");function trimSuffix(s,suffix){return endsWith(s,suffix)&&(s=s.slice(0,-suffix.length)),s}__name(trimSuffix,"trimSuffix");function getFileExtension(s){return s.match(/\.[A-Za-z0-9]+$/)?.[0]}__name(getFileExtension,"getFileExtension");function isRelativeSegment(s){return/^\.{0,2}$/.test(s)}__name(isRelativeSegment,"isRelativeSegment");function stripSlashes(s,onlyStripPrefix){return s.startsWith("/")&&(s=s.substring(1)),!onlyStripPrefix&&s.endsWith("/")&&(s=s.slice(0,-1)),s}__name(stripSlashes,"stripSlashes");function _addRelativeToStart(s){return s===""&&(s="."),s.startsWith(".")||(s=joinSegments(".",s)),s}__name(_addRelativeToStart,"_addRelativeToStart");import path from"path";import workerpool from"workerpool";import truncate from"ansi-truncate";import readline from"readline";var QuartzLogger=class{static{__name(this,"QuartzLogger")}verbose;spinnerInterval;spinnerText="";updateSuffix="";spinnerIndex=0;spinnerChars=["\u280B","\u2819","\u2839","\u2838","\u283C","\u2834","\u2826","\u2827","\u2807","\u280F"];constructor(verbose){let isInteractiveTerminal=process.stdout.isTTY&&process.env.TERM!=="dumb"&&!process.env.CI;this.verbose=verbose||!isInteractiveTerminal}start(text){this.spinnerText=text,this.verbose?console.log(text):(this.spinnerIndex=0,this.spinnerInterval=setInterval(()=>{readline.clearLine(process.stdout,0),readline.cursorTo(process.stdout,0);let columns=process.stdout.columns||80,output=`${this.spinnerChars[this.spinnerIndex]} ${this.spinnerText}`;this.updateSuffix&&(output+=`: ${this.updateSuffix}`);let truncated=truncate(output,columns);process.stdout.write(truncated),this.spinnerIndex=(this.spinnerIndex+1)%this.spinnerChars.length},50))}updateText(text){this.updateSuffix=text}end(text){!this.verbose&&this.spinnerInterval&&(clearInterval(this.spinnerInterval),this.spinnerInterval=void 0,readline.clearLine(process.stdout,0),readline.cursorTo(process.stdout,0)),text&&console.log(text)}};import{styleText as styleText2}from"util";import process2 from"process";import{isMainThread}from"workerpool";var rootFile=/.*at file:/;function trace(msg,err){let stack=err.stack??"",lines=[];lines.push(""),lines.push(`
`+styleText2(["bgRed","black","bold"]," ERROR ")+`

`+styleText2("red",` ${msg}`)+(err.message.length>0?`: ${err.message}`:""));let reachedEndOfLegibleTrace=!1;for(let line of stack.split(`
`).slice(1)){if(reachedEndOfLegibleTrace)break;line.includes("node_modules")||(lines.push(` ${line}`),rootFile.test(line)&&(reachedEndOfLegibleTrace=!0))}let traceMsg=lines.join(`
`);if(isMainThread)console.error(traceMsg),process2.exit(1);else throw new Error(traceMsg)}__name(trace,"trace");import{styleText as styleText3}from"util";function createMdProcessor(ctx){let transformers=ctx.cfg.plugins.transformers;return unified().use(remarkParse).use(transformers.flatMap(plugin=>plugin.markdownPlugins?.(ctx)??[]))}__name(createMdProcessor,"createMdProcessor");function createHtmlProcessor(ctx){let transformers=ctx.cfg.plugins.transformers;return unified().use(remarkRehype,{allowDangerousHtml:!0}).use(transformers.flatMap(plugin=>plugin.htmlPlugins?.(ctx)??[]))}__name(createHtmlProcessor,"createHtmlProcessor");function*chunks(arr,n){for(let i=0;i<arr.length;i+=n)yield arr.slice(i,i+n)}__name(chunks,"chunks");async function transpileWorkerScript(){return esbuild.build({entryPoints:["./quartz/worker.ts"],outfile:path.join(QUARTZ,"./.quartz-cache/transpiled-worker.mjs"),bundle:!0,keepNames:!0,platform:"node",format:"esm",packages:"external",sourcemap:!0,sourcesContent:!1,plugins:[{name:"css-and-scripts-as-text",setup(build){build.onLoad({filter:/\.scss$/},_=>({contents:"",loader:"text"})),build.onLoad({filter:/\.inline\.(ts|js)$/},_=>({contents:"",loader:"text"}))}}]})}__name(transpileWorkerScript,"transpileWorkerScript");function createFileParser(ctx,fps){let{argv,cfg}=ctx;return async processor=>{let res=[];for(let fp of fps)try{let perf=new PerfTimer,file=await read(fp);file.value=file.value.toString().trim();for(let plugin of cfg.plugins.transformers.filter(p=>p.textTransform))file.value=plugin.textTransform(ctx,file.value.toString());file.data.filePath=file.path,file.data.relativePath=path.posix.relative(argv.directory,file.path),file.data.slug=slugifyFilePath(file.data.relativePath);let ast=processor.parse(file),newAst=await processor.run(ast,file);res.push([newAst,file]),argv.verbose&&console.log(`[markdown] ${fp} -> ${file.data.slug} (${perf.timeSince()})`)}catch(err){trace(`
Failed to process markdown \`${fp}\``,err)}return res}}__name(createFileParser,"createFileParser");function createMarkdownParser(ctx,mdContent){return async processor=>{let res=[];for(let[ast,file]of mdContent)try{let perf=new PerfTimer,newAst=await processor.run(ast,file);res.push([newAst,file]),ctx.argv.verbose&&console.log(`[html] ${file.data.slug} (${perf.timeSince()})`)}catch(err){trace(`
Failed to process html \`${file.data.filePath}\``,err)}return res}}__name(createMarkdownParser,"createMarkdownParser");var clamp=__name((num,min,max)=>Math.min(Math.max(Math.round(num),min),max),"clamp");async function parseMarkdown(ctx,fps){let{argv}=ctx,perf=new PerfTimer,log=new QuartzLogger(argv.verbose),CHUNK_SIZE=128,concurrency=ctx.argv.concurrency??clamp(fps.length/CHUNK_SIZE,1,4),res=[];if(log.start(`Parsing input files using ${concurrency} threads`),concurrency===1)try{let mdRes=await createFileParser(ctx,fps)(createMdProcessor(ctx));res=await createMarkdownParser(ctx,mdRes)(createHtmlProcessor(ctx))}catch(error){throw log.end(),error}else{await transpileWorkerScript();let pool=workerpool.pool("./quartz/bootstrap-worker.mjs",{minWorkers:"max",maxWorkers:concurrency,workerType:"thread"}),errorHandler=__name(err=>{console.error(err),process.exit(1)},"errorHandler"),serializableCtx={buildId:ctx.buildId,argv:ctx.argv,allSlugs:ctx.allSlugs,allFiles:ctx.allFiles,incremental:ctx.incremental},textToMarkdownPromises=[],processedFiles=0;for(let chunk of chunks(fps,CHUNK_SIZE))textToMarkdownPromises.push(pool.exec("parseMarkdown",[serializableCtx,chunk]));let mdResults=await Promise.all(textToMarkdownPromises.map(async promise=>{let result=await promise;return processedFiles+=result.length,log.updateText(`text->markdown ${styleText3("gray",`${processedFiles}/${fps.length}`)}`),result})).catch(errorHandler),markdownToHtmlPromises=[];processedFiles=0;for(let mdChunk of mdResults)markdownToHtmlPromises.push(pool.exec("processHtml",[serializableCtx,mdChunk]));res=(await Promise.all(markdownToHtmlPromises.map(async promise=>{let result=await promise;return processedFiles+=result.length,log.updateText(`markdown->html ${styleText3("gray",`${processedFiles}/${fps.length}`)}`),result})).catch(errorHandler)).flat(),await pool.terminate()}return log.end(`Parsed ${res.length} Markdown files in ${perf.timeSince()}`),res}__name(parseMarkdown,"parseMarkdown");function filterContent(ctx,content){let{cfg,argv}=ctx,perf=new PerfTimer,initialLength=content.length;for(let plugin of cfg.plugins.filters){let updatedContent=content.filter(item=>plugin.shouldPublish(ctx,item));if(argv.verbose){let diff=content.filter(x=>!updatedContent.includes(x));for(let file of diff)console.log(`[filter:${plugin.name}] ${file[1].data.slug}`)}content=updatedContent}return console.log(`Filtered out ${initialLength-content.length} files in ${perf.timeSince()}`),content}__name(filterContent,"filterContent");import matter from"gray-matter";import remarkFrontmatter from"remark-frontmatter";import yaml from"js-yaml";import toml from"toml";var en_US_default={propertyDefaults:{title:"Untitled",description:"No description provided"},components:{callout:{note:"Note",abstract:"Abstract",info:"Info",todo:"Todo",tip:"Tip",success:"Success",question:"Question",warning:"Warning",failure:"Failure",danger:"Danger",bug:"Bug",example:"Example",quote:"Quote"},backlinks:{title:"Backlinks",noBacklinksFound:"No backlinks found"},themeToggle:{lightMode:"Light mode",darkMode:"Dark mode"},readerMode:{title:"Reader mode"},explorer:{title:"Explorer"},footer:{createdWith:"Created with"},graph:{title:"Graph View"},recentNotes:{title:"Recent Notes",seeRemainingMore:__name(({remaining})=>`See ${remaining} more \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclude of ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link to original"},search:{title:"Search",searchBarPlaceholder:"Search for something"},tableOfContents:{title:"Table of Contents"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"Recent notes",lastFewNotes:__name(({count})=>`Last ${count} notes`,"lastFewNotes")},error:{title:"Not Found",notFound:"Either this page is private or doesn't exist.",home:"Return to Homepage"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"1 item under this folder.":`${count} items under this folder.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Tag Index",itemsUnderTag:__name(({count})=>count===1?"1 item with this tag.":`${count} items with this tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Showing first ${count} tags.`,"showingFirst"),totalTags:__name(({count})=>`Found ${count} total tags.`,"totalTags")}}};var en_GB_default={propertyDefaults:{title:"Untitled",description:"No description provided"},components:{callout:{note:"Note",abstract:"Abstract",info:"Info",todo:"To-Do",tip:"Tip",success:"Success",question:"Question",warning:"Warning",failure:"Failure",danger:"Danger",bug:"Bug",example:"Example",quote:"Quote"},backlinks:{title:"Backlinks",noBacklinksFound:"No backlinks found"},themeToggle:{lightMode:"Light mode",darkMode:"Dark mode"},readerMode:{title:"Reader mode"},explorer:{title:"Explorer"},footer:{createdWith:"Created with"},graph:{title:"Graph View"},recentNotes:{title:"Recent Notes",seeRemainingMore:__name(({remaining})=>`See ${remaining} more \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclude of ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link to original"},search:{title:"Search",searchBarPlaceholder:"Search for something"},tableOfContents:{title:"Table of Contents"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"Recent notes",lastFewNotes:__name(({count})=>`Last ${count} notes`,"lastFewNotes")},error:{title:"Not Found",notFound:"Either this page is private or doesn't exist.",home:"Return to Homepage"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"1 item under this folder.":`${count} items under this folder.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Tag Index",itemsUnderTag:__name(({count})=>count===1?"1 item with this tag.":`${count} items with this tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Showing first ${count} tags.`,"showingFirst"),totalTags:__name(({count})=>`Found ${count} total tags.`,"totalTags")}}};var fr_FR_default={propertyDefaults:{title:"Sans titre",description:"Aucune description fournie"},components:{callout:{note:"Note",abstract:"R\xE9sum\xE9",info:"Info",todo:"\xC0 faire",tip:"Conseil",success:"Succ\xE8s",question:"Question",warning:"Avertissement",failure:"\xC9chec",danger:"Danger",bug:"Bogue",example:"Exemple",quote:"Citation"},backlinks:{title:"Liens retour",noBacklinksFound:"Aucun lien retour trouv\xE9"},themeToggle:{lightMode:"Mode clair",darkMode:"Mode sombre"},readerMode:{title:"Mode lecture"},explorer:{title:"Explorateur"},footer:{createdWith:"Cr\xE9\xE9 avec"},graph:{title:"Vue Graphique"},recentNotes:{title:"Notes R\xE9centes",seeRemainingMore:__name(({remaining})=>`Voir ${remaining} de plus \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclusion de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Lien vers l'original"},search:{title:"Recherche",searchBarPlaceholder:"Rechercher quelque chose"},tableOfContents:{title:"Table des Mati\xE8res"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min de lecture`,"readingTime")}},pages:{rss:{recentNotes:"Notes r\xE9centes",lastFewNotes:__name(({count})=>`Les derni\xE8res ${count} notes`,"lastFewNotes")},error:{title:"Introuvable",notFound:"Cette page est soit priv\xE9e, soit elle n'existe pas.",home:"Retour \xE0 la page d'accueil"},folderContent:{folder:"Dossier",itemsUnderFolder:__name(({count})=>count===1?"1 \xE9l\xE9ment sous ce dossier.":`${count} \xE9l\xE9ments sous ce dossier.`,"itemsUnderFolder")},tagContent:{tag:"\xC9tiquette",tagIndex:"Index des \xE9tiquettes",itemsUnderTag:__name(({count})=>count===1?"1 \xE9l\xE9ment avec cette \xE9tiquette.":`${count} \xE9l\xE9ments avec cette \xE9tiquette.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Affichage des premi\xE8res ${count} \xE9tiquettes.`,"showingFirst"),totalTags:__name(({count})=>`Trouv\xE9 ${count} \xE9tiquettes au total.`,"totalTags")}}};var it_IT_default={propertyDefaults:{title:"Senza titolo",description:"Nessuna descrizione"},components:{callout:{note:"Nota",abstract:"Abstract",info:"Info",todo:"Da fare",tip:"Consiglio",success:"Completato",question:"Domanda",warning:"Attenzione",failure:"Errore",danger:"Pericolo",bug:"Problema",example:"Esempio",quote:"Citazione"},backlinks:{title:"Link entranti",noBacklinksFound:"Nessun link entrante"},themeToggle:{lightMode:"Tema chiaro",darkMode:"Tema scuro"},readerMode:{title:"Modalit\xE0 lettura"},explorer:{title:"Esplora"},footer:{createdWith:"Creato con"},graph:{title:"Vista grafico"},recentNotes:{title:"Note recenti",seeRemainingMore:__name(({remaining})=>remaining===1?"Vedi 1 altra \u2192":`Vedi altre ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Inclusione di ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link all'originale"},search:{title:"Cerca",searchBarPlaceholder:"Cerca qualcosa"},tableOfContents:{title:"Indice"},contentMeta:{readingTime:__name(({minutes})=>minutes===1?"1 minuto":`${minutes} minuti`,"readingTime")}},pages:{rss:{recentNotes:"Note recenti",lastFewNotes:__name(({count})=>count===1?"Ultima nota":`Ultime ${count} note`,"lastFewNotes")},error:{title:"Non trovato",notFound:"Questa pagina \xE8 privata o non esiste.",home:"Ritorna alla home page"},folderContent:{folder:"Cartella",itemsUnderFolder:__name(({count})=>count===1?"1 oggetto in questa cartella.":`${count} oggetti in questa cartella.`,"itemsUnderFolder")},tagContent:{tag:"Etichetta",tagIndex:"Indice etichette",itemsUnderTag:__name(({count})=>count===1?"1 oggetto con questa etichetta.":`${count} oggetti con questa etichetta.`,"itemsUnderTag"),showingFirst:__name(({count})=>count===1?"Prima etichetta.":`Prime ${count} etichette.`,"showingFirst"),totalTags:__name(({count})=>count===1?"Trovata 1 etichetta in totale.":`Trovate ${count} etichette totali.`,"totalTags")}}};var ja_JP_default={propertyDefaults:{title:"\u7121\u984C",description:"\u8AAC\u660E\u306A\u3057"},components:{callout:{note:"\u30CE\u30FC\u30C8",abstract:"\u6284\u9332",info:"\u60C5\u5831",todo:"\u3084\u308B\u3079\u304D\u3053\u3068",tip:"\u30D2\u30F3\u30C8",success:"\u6210\u529F",question:"\u8CEA\u554F",warning:"\u8B66\u544A",failure:"\u5931\u6557",danger:"\u5371\u967A",bug:"\u30D0\u30B0",example:"\u4F8B",quote:"\u5F15\u7528"},backlinks:{title:"\u30D0\u30C3\u30AF\u30EA\u30F3\u30AF",noBacklinksFound:"\u30D0\u30C3\u30AF\u30EA\u30F3\u30AF\u306F\u3042\u308A\u307E\u305B\u3093"},themeToggle:{lightMode:"\u30E9\u30A4\u30C8\u30E2\u30FC\u30C9",darkMode:"\u30C0\u30FC\u30AF\u30E2\u30FC\u30C9"},readerMode:{title:"\u30EA\u30FC\u30C0\u30FC\u30E2\u30FC\u30C9"},explorer:{title:"\u30A8\u30AF\u30B9\u30D7\u30ED\u30FC\u30E9\u30FC"},footer:{createdWith:"\u4F5C\u6210"},graph:{title:"\u30B0\u30E9\u30D5\u30D3\u30E5\u30FC"},recentNotes:{title:"\u6700\u8FD1\u306E\u8A18\u4E8B",seeRemainingMore:__name(({remaining})=>`\u3055\u3089\u306B${remaining}\u4EF6 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug}\u306E\u307E\u3068\u3081`,"transcludeOf"),linkToOriginal:"\u5143\u8A18\u4E8B\u3078\u306E\u30EA\u30F3\u30AF"},search:{title:"\u691C\u7D22",searchBarPlaceholder:"\u691C\u7D22\u30EF\u30FC\u30C9\u3092\u5165\u529B"},tableOfContents:{title:"\u76EE\u6B21"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"\u6700\u8FD1\u306E\u8A18\u4E8B",lastFewNotes:__name(({count})=>`\u6700\u65B0\u306E${count}\u4EF6`,"lastFewNotes")},error:{title:"Not Found",notFound:"\u30DA\u30FC\u30B8\u304C\u5B58\u5728\u3057\u306A\u3044\u304B\u3001\u975E\u516C\u958B\u8A2D\u5B9A\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002",home:"\u30DB\u30FC\u30E0\u30DA\u30FC\u30B8\u306B\u623B\u308B"},folderContent:{folder:"\u30D5\u30A9\u30EB\u30C0",itemsUnderFolder:__name(({count})=>`${count}\u4EF6\u306E\u30DA\u30FC\u30B8`,"itemsUnderFolder")},tagContent:{tag:"\u30BF\u30B0",tagIndex:"\u30BF\u30B0\u4E00\u89A7",itemsUnderTag:__name(({count})=>`${count}\u4EF6\u306E\u30DA\u30FC\u30B8`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u306E\u3046\u3061\u6700\u521D\u306E${count}\u4EF6\u3092\u8868\u793A\u3057\u3066\u3044\u307E\u3059`,"showingFirst"),totalTags:__name(({count})=>`\u5168${count}\u500B\u306E\u30BF\u30B0\u3092\u8868\u793A\u4E2D`,"totalTags")}}};var de_DE_default={propertyDefaults:{title:"Unbenannt",description:"Keine Beschreibung angegeben"},components:{callout:{note:"Hinweis",abstract:"Zusammenfassung",info:"Info",todo:"Zu erledigen",tip:"Tipp",success:"Erfolg",question:"Frage",warning:"Warnung",failure:"Fehlgeschlagen",danger:"Gefahr",bug:"Fehler",example:"Beispiel",quote:"Zitat"},backlinks:{title:"Backlinks",noBacklinksFound:"Keine Backlinks gefunden"},themeToggle:{lightMode:"Heller Modus",darkMode:"Dunkler Modus"},readerMode:{title:"Lesemodus"},explorer:{title:"Explorer"},footer:{createdWith:"Erstellt mit"},graph:{title:"Graphansicht"},recentNotes:{title:"Zuletzt bearbeitete Seiten",seeRemainingMore:__name(({remaining})=>`${remaining} weitere ansehen \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transklusion von ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link zum Original"},search:{title:"Suche",searchBarPlaceholder:"Suche nach etwas"},tableOfContents:{title:"Inhaltsverzeichnis"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} Min. Lesezeit`,"readingTime")}},pages:{rss:{recentNotes:"Zuletzt bearbeitete Seiten",lastFewNotes:__name(({count})=>`Letzte ${count} Seiten`,"lastFewNotes")},error:{title:"Nicht gefunden",notFound:"Diese Seite ist entweder nicht \xF6ffentlich oder existiert nicht.",home:"Zur Startseite"},folderContent:{folder:"Ordner",itemsUnderFolder:__name(({count})=>count===1?"1 Datei in diesem Ordner.":`${count} Dateien in diesem Ordner.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Tag-\xDCbersicht",itemsUnderTag:__name(({count})=>count===1?"1 Datei mit diesem Tag.":`${count} Dateien mit diesem Tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Die ersten ${count} Tags werden angezeigt.`,"showingFirst"),totalTags:__name(({count})=>`${count} Tags insgesamt.`,"totalTags")}}};var nl_NL_default={propertyDefaults:{title:"Naamloos",description:"Geen beschrijving gegeven."},components:{callout:{note:"Notitie",abstract:"Samenvatting",info:"Info",todo:"Te doen",tip:"Tip",success:"Succes",question:"Vraag",warning:"Waarschuwing",failure:"Mislukking",danger:"Gevaar",bug:"Bug",example:"Voorbeeld",quote:"Citaat"},backlinks:{title:"Backlinks",noBacklinksFound:"Geen backlinks gevonden"},themeToggle:{lightMode:"Lichte modus",darkMode:"Donkere modus"},readerMode:{title:"Leesmodus"},explorer:{title:"Verkenner"},footer:{createdWith:"Gemaakt met"},graph:{title:"Grafiekweergave"},recentNotes:{title:"Recente notities",seeRemainingMore:__name(({remaining})=>`Zie ${remaining} meer \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Invoeging van ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link naar origineel"},search:{title:"Zoeken",searchBarPlaceholder:"Doorzoek de website"},tableOfContents:{title:"Inhoudsopgave"},contentMeta:{readingTime:__name(({minutes})=>minutes===1?"1 minuut leestijd":`${minutes} minuten leestijd`,"readingTime")}},pages:{rss:{recentNotes:"Recente notities",lastFewNotes:__name(({count})=>`Laatste ${count} notities`,"lastFewNotes")},error:{title:"Niet gevonden",notFound:"Deze pagina is niet zichtbaar of bestaat niet.",home:"Keer terug naar de start pagina"},folderContent:{folder:"Map",itemsUnderFolder:__name(({count})=>count===1?"1 item in deze map.":`${count} items in deze map.`,"itemsUnderFolder")},tagContent:{tag:"Label",tagIndex:"Label-index",itemsUnderTag:__name(({count})=>count===1?"1 item met dit label.":`${count} items met dit label.`,"itemsUnderTag"),showingFirst:__name(({count})=>count===1?"Eerste label tonen.":`Eerste ${count} labels tonen.`,"showingFirst"),totalTags:__name(({count})=>`${count} labels gevonden.`,"totalTags")}}};var ro_RO_default={propertyDefaults:{title:"F\u0103r\u0103 titlu",description:"Nici o descriere furnizat\u0103"},components:{callout:{note:"Not\u0103",abstract:"Rezumat",info:"Informa\u021Bie",todo:"De f\u0103cut",tip:"Sfat",success:"Succes",question:"\xCEntrebare",warning:"Avertisment",failure:"E\u0219ec",danger:"Pericol",bug:"Bug",example:"Exemplu",quote:"Citat"},backlinks:{title:"Leg\u0103turi \xEEnapoi",noBacklinksFound:"Nu s-au g\u0103sit leg\u0103turi \xEEnapoi"},themeToggle:{lightMode:"Modul luminos",darkMode:"Modul \xEEntunecat"},readerMode:{title:"Modul de citire"},explorer:{title:"Explorator"},footer:{createdWith:"Creat cu"},graph:{title:"Graf"},recentNotes:{title:"Noti\u021Be recente",seeRemainingMore:__name(({remaining})=>`Vezi \xEEnc\u0103 ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Extras din ${targetSlug}`,"transcludeOf"),linkToOriginal:"Leg\u0103tur\u0103 c\u0103tre original"},search:{title:"C\u0103utare",searchBarPlaceholder:"Introduce\u021Bi termenul de c\u0103utare..."},tableOfContents:{title:"Cuprins"},contentMeta:{readingTime:__name(({minutes})=>minutes==1?"lectur\u0103 de 1 minut":`lectur\u0103 de ${minutes} minute`,"readingTime")}},pages:{rss:{recentNotes:"Noti\u021Be recente",lastFewNotes:__name(({count})=>`Ultimele ${count} noti\u021Be`,"lastFewNotes")},error:{title:"Pagina nu a fost g\u0103sit\u0103",notFound:"Fie aceast\u0103 pagin\u0103 este privat\u0103, fie nu exist\u0103.",home:"Reveni\u021Bi la pagina de pornire"},folderContent:{folder:"Dosar",itemsUnderFolder:__name(({count})=>count===1?"1 articol \xEEn acest dosar.":`${count} elemente \xEEn acest dosar.`,"itemsUnderFolder")},tagContent:{tag:"Etichet\u0103",tagIndex:"Indexul etichetelor",itemsUnderTag:__name(({count})=>count===1?"1 articol cu aceast\u0103 etichet\u0103.":`${count} articole cu aceast\u0103 etichet\u0103.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Se afi\u0219eaz\u0103 primele ${count} etichete.`,"showingFirst"),totalTags:__name(({count})=>`Au fost g\u0103site ${count} etichete \xEEn total.`,"totalTags")}}};var ca_ES_default={propertyDefaults:{title:"Sense t\xEDtol",description:"Sense descripci\xF3"},components:{callout:{note:"Nota",abstract:"Resum",info:"Informaci\xF3",todo:"Per fer",tip:"Consell",success:"\xC8xit",question:"Pregunta",warning:"Advert\xE8ncia",failure:"Fall",danger:"Perill",bug:"Error",example:"Exemple",quote:"Cita"},backlinks:{title:"Retroenlla\xE7",noBacklinksFound:"No s'han trobat retroenlla\xE7os"},themeToggle:{lightMode:"Mode clar",darkMode:"Mode fosc"},readerMode:{title:"Mode lector"},explorer:{title:"Explorador"},footer:{createdWith:"Creat amb"},graph:{title:"Vista Gr\xE0fica"},recentNotes:{title:"Notes Recents",seeRemainingMore:__name(({remaining})=>`Vegi ${remaining} m\xE9s \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transcluit de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Enlla\xE7 a l'original"},search:{title:"Cercar",searchBarPlaceholder:"Cerca alguna cosa"},tableOfContents:{title:"Taula de Continguts"},contentMeta:{readingTime:__name(({minutes})=>`Es llegeix en ${minutes} min`,"readingTime")}},pages:{rss:{recentNotes:"Notes recents",lastFewNotes:__name(({count})=>`\xDAltimes ${count} notes`,"lastFewNotes")},error:{title:"No s'ha trobat.",notFound:"Aquesta p\xE0gina \xE9s privada o no existeix.",home:"Torna a la p\xE0gina principal"},folderContent:{folder:"Carpeta",itemsUnderFolder:__name(({count})=>count===1?"1 article en aquesta carpeta.":`${count} articles en esta carpeta.`,"itemsUnderFolder")},tagContent:{tag:"Etiqueta",tagIndex:"\xEDndex d'Etiquetes",itemsUnderTag:__name(({count})=>count===1?"1 article amb aquesta etiqueta.":`${count} article amb aquesta etiqueta.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Mostrant les primeres ${count} etiquetes.`,"showingFirst"),totalTags:__name(({count})=>`S'han trobat ${count} etiquetes en total.`,"totalTags")}}};var es_ES_default={propertyDefaults:{title:"Sin t\xEDtulo",description:"Sin descripci\xF3n"},components:{callout:{note:"Nota",abstract:"Resumen",info:"Informaci\xF3n",todo:"Por hacer",tip:"Consejo",success:"\xC9xito",question:"Pregunta",warning:"Advertencia",failure:"Fallo",danger:"Peligro",bug:"Error",example:"Ejemplo",quote:"Cita"},backlinks:{title:"Retroenlaces",noBacklinksFound:"No se han encontrado retroenlaces"},themeToggle:{lightMode:"Modo claro",darkMode:"Modo oscuro"},readerMode:{title:"Modo lector"},explorer:{title:"Explorador"},footer:{createdWith:"Creado con"},graph:{title:"Vista Gr\xE1fica"},recentNotes:{title:"Notas Recientes",seeRemainingMore:__name(({remaining})=>`Vea ${remaining} m\xE1s \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transcluido de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Enlace al original"},search:{title:"Buscar",searchBarPlaceholder:"Busca algo"},tableOfContents:{title:"Tabla de Contenidos"},contentMeta:{readingTime:__name(({minutes})=>`Se lee en ${minutes} min`,"readingTime")}},pages:{rss:{recentNotes:"Notas recientes",lastFewNotes:__name(({count})=>`\xDAltimas ${count} notas`,"lastFewNotes")},error:{title:"No se ha encontrado.",notFound:"Esta p\xE1gina es privada o no existe.",home:"Regresa a la p\xE1gina principal"},folderContent:{folder:"Carpeta",itemsUnderFolder:__name(({count})=>count===1?"1 art\xEDculo en esta carpeta.":`${count} art\xEDculos en esta carpeta.`,"itemsUnderFolder")},tagContent:{tag:"Etiqueta",tagIndex:"\xCDndice de Etiquetas",itemsUnderTag:__name(({count})=>count===1?"1 art\xEDculo con esta etiqueta.":`${count} art\xEDculos con esta etiqueta.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Mostrando las primeras ${count} etiquetas.`,"showingFirst"),totalTags:__name(({count})=>`Se han encontrado ${count} etiquetas en total.`,"totalTags")}}};var ar_SA_default={propertyDefaults:{title:"\u063A\u064A\u0631 \u0645\u0639\u0646\u0648\u0646",description:"\u0644\u0645 \u064A\u062A\u0645 \u062A\u0642\u062F\u064A\u0645 \u0623\u064A \u0648\u0635\u0641"},direction:"rtl",components:{callout:{note:"\u0645\u0644\u0627\u062D\u0638\u0629",abstract:"\u0645\u0644\u062E\u0635",info:"\u0645\u0639\u0644\u0648\u0645\u0627\u062A",todo:"\u0644\u0644\u0642\u064A\u0627\u0645",tip:"\u0646\u0635\u064A\u062D\u0629",success:"\u0646\u062C\u0627\u062D",question:"\u0633\u0624\u0627\u0644",warning:"\u062A\u062D\u0630\u064A\u0631",failure:"\u0641\u0634\u0644",danger:"\u062E\u0637\u0631",bug:"\u062E\u0644\u0644",example:"\u0645\u062B\u0627\u0644",quote:"\u0627\u0642\u062A\u0628\u0627\u0633"},backlinks:{title:"\u0648\u0635\u0644\u0627\u062A \u0627\u0644\u0639\u0648\u062F\u0629",noBacklinksFound:"\u0644\u0627 \u064A\u0648\u062C\u062F \u0648\u0635\u0644\u0627\u062A \u0639\u0648\u062F\u0629"},themeToggle:{lightMode:"\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0646\u0647\u0627\u0631\u064A",darkMode:"\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0644\u064A\u0644\u064A"},explorer:{title:"\u0627\u0644\u0645\u0633\u062A\u0639\u0631\u0636"},readerMode:{title:"\u0648\u0636\u0639 \u0627\u0644\u0642\u0627\u0631\u0626"},footer:{createdWith:"\u0623\u064F\u0646\u0634\u0626 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645"},graph:{title:"\u0627\u0644\u062A\u0645\u062B\u064A\u0644 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A"},recentNotes:{title:"\u0622\u062E\u0631 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A",seeRemainingMore:__name(({remaining})=>`\u062A\u0635\u0641\u062D ${remaining} \u0623\u0643\u062B\u0631 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0645\u0642\u062A\u0628\u0633 \u0645\u0646 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0648\u0635\u0644\u0629 \u0644\u0644\u0645\u0644\u0627\u062D\u0638\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u0629"},search:{title:"\u0628\u062D\u062B",searchBarPlaceholder:"\u0627\u0628\u062D\u062B \u0639\u0646 \u0634\u064A\u0621 \u0645\u0627"},tableOfContents:{title:"\u0641\u0647\u0631\u0633 \u0627\u0644\u0645\u062D\u062A\u0648\u064A\u0627\u062A"},contentMeta:{readingTime:__name(({minutes})=>minutes==1?"\u062F\u0642\u064A\u0642\u0629 \u0623\u0648 \u0623\u0642\u0644 \u0644\u0644\u0642\u0631\u0627\u0621\u0629":minutes==2?"\u062F\u0642\u064A\u0642\u062A\u0627\u0646 \u0644\u0644\u0642\u0631\u0627\u0621\u0629":`${minutes} \u062F\u0642\u0627\u0626\u0642 \u0644\u0644\u0642\u0631\u0627\u0621\u0629`,"readingTime")}},pages:{rss:{recentNotes:"\u0622\u062E\u0631 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A",lastFewNotes:__name(({count})=>`\u0622\u062E\u0631 ${count} \u0645\u0644\u0627\u062D\u0638\u0629`,"lastFewNotes")},error:{title:"\u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F",notFound:"\u0625\u0645\u0627 \u0623\u0646 \u0647\u0630\u0647 \u0627\u0644\u0635\u0641\u062D\u0629 \u062E\u0627\u0635\u0629 \u0623\u0648 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629.",home:"\u0627\u0644\u0639\u0648\u062F\u0647 \u0644\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"},folderContent:{folder:"\u0645\u062C\u0644\u062F",itemsUnderFolder:__name(({count})=>count===1?"\u064A\u0648\u062C\u062F \u0639\u0646\u0635\u0631 \u0648\u0627\u062D\u062F \u0641\u0642\u0637 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0644\u062F":`\u064A\u0648\u062C\u062F ${count} \u0639\u0646\u0627\u0635\u0631 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0644\u062F.`,"itemsUnderFolder")},tagContent:{tag:"\u0627\u0644\u0648\u0633\u0645",tagIndex:"\u0645\u0624\u0634\u0631 \u0627\u0644\u0648\u0633\u0645",itemsUnderTag:__name(({count})=>count===1?"\u064A\u0648\u062C\u062F \u0639\u0646\u0635\u0631 \u0648\u0627\u062D\u062F \u0641\u0642\u0637 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0648\u0633\u0645":`\u064A\u0648\u062C\u062F ${count} \u0639\u0646\u0627\u0635\u0631 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0648\u0633\u0645.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0625\u0638\u0647\u0627\u0631 \u0623\u0648\u0644 ${count} \u0623\u0648\u0633\u0645\u0629.`,"showingFirst"),totalTags:__name(({count})=>`\u064A\u0648\u062C\u062F ${count} \u0623\u0648\u0633\u0645\u0629.`,"totalTags")}}};var uk_UA_default={propertyDefaults:{title:"\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0438",description:"\u041E\u043F\u0438\u0441 \u043D\u0435 \u043D\u0430\u0434\u0430\u043D\u043E"},components:{callout:{note:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0430",abstract:"\u0410\u0431\u0441\u0442\u0440\u0430\u043A\u0442",info:"\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0456\u044F",todo:"\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F",tip:"\u041F\u043E\u0440\u0430\u0434\u0430",success:"\u0423\u0441\u043F\u0456\u0445",question:"\u041F\u0438\u0442\u0430\u043D\u043D\u044F",warning:"\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F",failure:"\u041D\u0435\u0432\u0434\u0430\u0447\u0430",danger:"\u041D\u0435\u0431\u0435\u0437\u043F\u0435\u043A\u0430",bug:"\u0411\u0430\u0433",example:"\u041F\u0440\u0438\u043A\u043B\u0430\u0434",quote:"\u0426\u0438\u0442\u0430\u0442\u0430"},backlinks:{title:"\u0417\u0432\u043E\u0440\u043E\u0442\u043D\u0456 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",noBacklinksFound:"\u0417\u0432\u043E\u0440\u043E\u0442\u043D\u0438\u0445 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u044C \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E"},themeToggle:{lightMode:"\u0421\u0432\u0456\u0442\u043B\u0438\u0439 \u0440\u0435\u0436\u0438\u043C",darkMode:"\u0422\u0435\u043C\u043D\u0438\u0439 \u0440\u0435\u0436\u0438\u043C"},readerMode:{title:"\u0420\u0435\u0436\u0438\u043C \u0447\u0438\u0442\u0430\u043D\u043D\u044F"},explorer:{title:"\u041F\u0440\u043E\u0432\u0456\u0434\u043D\u0438\u043A"},footer:{createdWith:"\u0421\u0442\u0432\u043E\u0440\u0435\u043D\u043E \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E"},graph:{title:"\u0412\u0438\u0433\u043B\u044F\u0434 \u0433\u0440\u0430\u0444\u0430"},recentNotes:{title:"\u041E\u0441\u0442\u0430\u043D\u043D\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438",seeRemainingMore:__name(({remaining})=>`\u041F\u0435\u0440\u0435\u0433\u043B\u044F\u043D\u0443\u0442\u0438 \u0449\u0435 ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0412\u0438\u0434\u043E\u0431\u0443\u0442\u043E \u0437 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u041F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u043D\u0430 \u043E\u0440\u0438\u0433\u0456\u043D\u0430\u043B"},search:{title:"\u041F\u043E\u0448\u0443\u043A",searchBarPlaceholder:"\u0428\u0443\u043A\u0430\u0442\u0438 \u0449\u043E\u0441\u044C"},tableOfContents:{title:"\u0417\u043C\u0456\u0441\u0442"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} \u0445\u0432 \u0447\u0438\u0442\u0430\u043D\u043D\u044F`,"readingTime")}},pages:{rss:{recentNotes:"\u041E\u0441\u0442\u0430\u043D\u043D\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438",lastFewNotes:__name(({count})=>`\u041E\u0441\u0442\u0430\u043D\u043D\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438: ${count}`,"lastFewNotes")},error:{title:"\u041D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E",notFound:"\u0426\u044F \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0430 \u0430\u0431\u043E \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u0430, \u0430\u0431\u043E \u043D\u0435 \u0456\u0441\u043D\u0443\u0454.",home:"\u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438\u0441\u044F \u043D\u0430 \u0433\u043E\u043B\u043E\u0432\u043D\u0443 \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0443"},folderContent:{folder:"\u0422\u0435\u043A\u0430",itemsUnderFolder:__name(({count})=>count===1?"\u0423 \u0446\u0456\u0439 \u0442\u0435\u0446\u0456 1 \u0435\u043B\u0435\u043C\u0435\u043D\u0442.":`\u0415\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 \u0443 \u0446\u0456\u0439 \u0442\u0435\u0446\u0456: ${count}.`,"itemsUnderFolder")},tagContent:{tag:"\u041C\u0456\u0442\u043A\u0430",tagIndex:"\u0406\u043D\u0434\u0435\u043A\u0441 \u043C\u0456\u0442\u043A\u0438",itemsUnderTag:__name(({count})=>count===1?"1 \u0435\u043B\u0435\u043C\u0435\u043D\u0442 \u0437 \u0446\u0456\u0454\u044E \u043C\u0456\u0442\u043A\u043E\u044E.":`\u0415\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 \u0437 \u0446\u0456\u0454\u044E \u043C\u0456\u0442\u043A\u043E\u044E: ${count}.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u041F\u043E\u043A\u0430\u0437 \u043F\u0435\u0440\u0448\u0438\u0445 ${count} \u043C\u0456\u0442\u043E\u043A.`,"showingFirst"),totalTags:__name(({count})=>`\u0412\u0441\u044C\u043E\u0433\u043E \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043C\u0456\u0442\u043E\u043A: ${count}.`,"totalTags")}}};var ru_RU_default={propertyDefaults:{title:"\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F",description:"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442"},components:{callout:{note:"\u0417\u0430\u043C\u0435\u0442\u043A\u0430",abstract:"\u0420\u0435\u0437\u044E\u043C\u0435",info:"\u0418\u043D\u0444\u043E",todo:"\u0421\u0434\u0435\u043B\u0430\u0442\u044C",tip:"\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430",success:"\u0423\u0441\u043F\u0435\u0445",question:"\u0412\u043E\u043F\u0440\u043E\u0441",warning:"\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435",failure:"\u041D\u0435\u0443\u0434\u0430\u0447\u0430",danger:"\u041E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C",bug:"\u0411\u0430\u0433",example:"\u041F\u0440\u0438\u043C\u0435\u0440",quote:"\u0426\u0438\u0442\u0430\u0442\u0430"},backlinks:{title:"\u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0435 \u0441\u0441\u044B\u043B\u043A\u0438",noBacklinksFound:"\u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0435 \u0441\u0441\u044B\u043B\u043A\u0438 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442"},themeToggle:{lightMode:"\u0421\u0432\u0435\u0442\u043B\u044B\u0439 \u0440\u0435\u0436\u0438\u043C",darkMode:"\u0422\u0451\u043C\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C"},readerMode:{title:"\u0420\u0435\u0436\u0438\u043C \u0447\u0442\u0435\u043D\u0438\u044F"},explorer:{title:"\u041F\u0440\u043E\u0432\u043E\u0434\u043D\u0438\u043A"},footer:{createdWith:"\u0421\u043E\u0437\u0434\u0430\u043D\u043E \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E"},graph:{title:"\u0412\u0438\u0434 \u0433\u0440\u0430\u0444\u0430"},recentNotes:{title:"\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438",seeRemainingMore:__name(({remaining})=>`\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043E\u0441\u0442\u0430\u0432\u0448${getForm(remaining,"\u0443\u044E\u0441\u044F","\u0438\u0435\u0441\u044F","\u0438\u0435\u0441\u044F")} ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u0438\u0437 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B"},search:{title:"\u041F\u043E\u0438\u0441\u043A",searchBarPlaceholder:"\u041D\u0430\u0439\u0442\u0438 \u0447\u0442\u043E-\u043D\u0438\u0431\u0443\u0434\u044C"},tableOfContents:{title:"\u041E\u0433\u043B\u0430\u0432\u043B\u0435\u043D\u0438\u0435"},contentMeta:{readingTime:__name(({minutes})=>`\u0432\u0440\u0435\u043C\u044F \u0447\u0442\u0435\u043D\u0438\u044F ~${minutes} \u043C\u0438\u043D.`,"readingTime")}},pages:{rss:{recentNotes:"\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438",lastFewNotes:__name(({count})=>`\u041F\u043E\u0441\u043B\u0435\u0434\u043D${getForm(count,"\u044F\u044F","\u0438\u0435","\u0438\u0435")} ${count} \u0437\u0430\u043C\u0435\u0442${getForm(count,"\u043A\u0430","\u043A\u0438","\u043E\u043A")}`,"lastFewNotes")},error:{title:"\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430",notFound:"\u042D\u0442\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u0430\u044F \u0438\u043B\u0438 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",home:"\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443"},folderContent:{folder:"\u041F\u0430\u043F\u043A\u0430",itemsUnderFolder:__name(({count})=>`\u0432 \u044D\u0442\u043E\u0439 \u043F\u0430\u043F\u043A\u0435 ${count} \u044D\u043B\u0435\u043C\u0435\u043D\u0442${getForm(count,"","\u0430","\u043E\u0432")}`,"itemsUnderFolder")},tagContent:{tag:"\u0422\u0435\u0433",tagIndex:"\u0418\u043D\u0434\u0435\u043A\u0441 \u0442\u0435\u0433\u043E\u0432",itemsUnderTag:__name(({count})=>`\u0441 \u044D\u0442\u0438\u043C \u0442\u0435\u0433\u043E\u043C ${count} \u044D\u043B\u0435\u043C\u0435\u043D\u0442${getForm(count,"","\u0430","\u043E\u0432")}`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430${getForm(count,"\u0435\u0442\u0441\u044F","\u044E\u0442\u0441\u044F","\u044E\u0442\u0441\u044F")} ${count} \u0442\u0435\u0433${getForm(count,"","\u0430","\u043E\u0432")}`,"showingFirst"),totalTags:__name(({count})=>`\u0412\u0441\u0435\u0433\u043E ${count} \u0442\u0435\u0433${getForm(count,"","\u0430","\u043E\u0432")}`,"totalTags")}}};function getForm(number,form1,form2,form5){let remainder100=number%100,remainder10=remainder100%10;return remainder100>=10&&remainder100<=20?form5:remainder10>1&&remainder10<5?form2:remainder10==1?form1:form5}__name(getForm,"getForm");var ko_KR_default={propertyDefaults:{title:"\uC81C\uBAA9 \uC5C6\uC74C",description:"\uC124\uBA85 \uC5C6\uC74C"},components:{callout:{note:"\uB178\uD2B8",abstract:"\uAC1C\uC694",info:"\uC815\uBCF4",todo:"\uD560\uC77C",tip:"\uD301",success:"\uC131\uACF5",question:"\uC9C8\uBB38",warning:"\uC8FC\uC758",failure:"\uC2E4\uD328",danger:"\uC704\uD5D8",bug:"\uBC84\uADF8",example:"\uC608\uC2DC",quote:"\uC778\uC6A9"},backlinks:{title:"\uBC31\uB9C1\uD06C",noBacklinksFound:"\uBC31\uB9C1\uD06C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."},themeToggle:{lightMode:"\uB77C\uC774\uD2B8 \uBAA8\uB4DC",darkMode:"\uB2E4\uD06C \uBAA8\uB4DC"},readerMode:{title:"\uB9AC\uB354 \uBAA8\uB4DC"},explorer:{title:"\uD0D0\uC0C9\uAE30"},footer:{createdWith:"Created with"},graph:{title:"\uADF8\uB798\uD504 \uBDF0"},recentNotes:{title:"\uCD5C\uADFC \uAC8C\uC2DC\uAE00",seeRemainingMore:__name(({remaining})=>`${remaining}\uAC74 \uB354\uBCF4\uAE30 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug}\uC758 \uD3EC\uD568`,"transcludeOf"),linkToOriginal:"\uC6D0\uBCF8 \uB9C1\uD06C"},search:{title:"\uAC80\uC0C9",searchBarPlaceholder:"\uAC80\uC0C9\uC5B4\uB97C \uC785\uB825\uD558\uC138\uC694"},tableOfContents:{title:"\uBAA9\uCC28"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"\uCD5C\uADFC \uAC8C\uC2DC\uAE00",lastFewNotes:__name(({count})=>`\uCD5C\uADFC ${count} \uAC74`,"lastFewNotes")},error:{title:"Not Found",notFound:"\uD398\uC774\uC9C0\uAC00 \uC874\uC7AC\uD558\uC9C0 \uC54A\uAC70\uB098 \uBE44\uACF5\uAC1C \uC124\uC815\uC774 \uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.",home:"\uD648\uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAE30"},folderContent:{folder:"\uD3F4\uB354",itemsUnderFolder:__name(({count})=>`${count}\uAC74\uC758 \uD56D\uBAA9`,"itemsUnderFolder")},tagContent:{tag:"\uD0DC\uADF8",tagIndex:"\uD0DC\uADF8 \uBAA9\uB85D",itemsUnderTag:__name(({count})=>`${count}\uAC74\uC758 \uD56D\uBAA9`,"itemsUnderTag"),showingFirst:__name(({count})=>`\uCC98\uC74C ${count}\uAC1C\uC758 \uD0DC\uADF8`,"showingFirst"),totalTags:__name(({count})=>`\uCD1D ${count}\uAC1C\uC758 \uD0DC\uADF8\uB97C \uCC3E\uC558\uC2B5\uB2C8\uB2E4.`,"totalTags")}}};var zh_CN_default={propertyDefaults:{title:"\u65E0\u9898",description:"\u65E0\u63CF\u8FF0"},components:{callout:{note:"\u7B14\u8BB0",abstract:"\u6458\u8981",info:"\u63D0\u793A",todo:"\u5F85\u529E",tip:"\u63D0\u793A",success:"\u6210\u529F",question:"\u95EE\u9898",warning:"\u8B66\u544A",failure:"\u5931\u8D25",danger:"\u5371\u9669",bug:"\u9519\u8BEF",example:"\u793A\u4F8B",quote:"\u5F15\u7528"},backlinks:{title:"\u53CD\u5411\u94FE\u63A5",noBacklinksFound:"\u65E0\u6CD5\u627E\u5230\u53CD\u5411\u94FE\u63A5"},themeToggle:{lightMode:"\u4EAE\u8272\u6A21\u5F0F",darkMode:"\u6697\u8272\u6A21\u5F0F"},readerMode:{title:"\u9605\u8BFB\u6A21\u5F0F"},explorer:{title:"\u63A2\u7D22"},footer:{createdWith:"Created with"},graph:{title:"\u5173\u7CFB\u56FE\u8C31"},recentNotes:{title:"\u6700\u8FD1\u7684\u7B14\u8BB0",seeRemainingMore:__name(({remaining})=>`\u67E5\u770B\u66F4\u591A${remaining}\u7BC7\u7B14\u8BB0 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u5305\u542B${targetSlug}`,"transcludeOf"),linkToOriginal:"\u6307\u5411\u539F\u59CB\u7B14\u8BB0\u7684\u94FE\u63A5"},search:{title:"\u641C\u7D22",searchBarPlaceholder:"\u641C\u7D22\u4E9B\u4EC0\u4E48"},tableOfContents:{title:"\u76EE\u5F55"},contentMeta:{readingTime:__name(({minutes})=>`${minutes}\u5206\u949F\u9605\u8BFB`,"readingTime")}},pages:{rss:{recentNotes:"\u6700\u8FD1\u7684\u7B14\u8BB0",lastFewNotes:__name(({count})=>`\u6700\u8FD1\u7684${count}\u6761\u7B14\u8BB0`,"lastFewNotes")},error:{title:"\u65E0\u6CD5\u627E\u5230",notFound:"\u79C1\u6709\u7B14\u8BB0\u6216\u7B14\u8BB0\u4E0D\u5B58\u5728\u3002",home:"\u8FD4\u56DE\u9996\u9875"},folderContent:{folder:"\u6587\u4EF6\u5939",itemsUnderFolder:__name(({count})=>`\u6B64\u6587\u4EF6\u5939\u4E0B\u6709${count}\u6761\u7B14\u8BB0\u3002`,"itemsUnderFolder")},tagContent:{tag:"\u6807\u7B7E",tagIndex:"\u6807\u7B7E\u7D22\u5F15",itemsUnderTag:__name(({count})=>`\u6B64\u6807\u7B7E\u4E0B\u6709${count}\u6761\u7B14\u8BB0\u3002`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u663E\u793A\u524D${count}\u4E2A\u6807\u7B7E\u3002`,"showingFirst"),totalTags:__name(({count})=>`\u603B\u5171\u6709${count}\u4E2A\u6807\u7B7E\u3002`,"totalTags")}}};var zh_TW_default={propertyDefaults:{title:"\u7121\u984C",description:"\u7121\u63CF\u8FF0"},components:{callout:{note:"\u7B46\u8A18",abstract:"\u6458\u8981",info:"\u63D0\u793A",todo:"\u5F85\u8FA6",tip:"\u63D0\u793A",success:"\u6210\u529F",question:"\u554F\u984C",warning:"\u8B66\u544A",failure:"\u5931\u6557",danger:"\u5371\u96AA",bug:"\u932F\u8AA4",example:"\u7BC4\u4F8B",quote:"\u5F15\u7528"},backlinks:{title:"\u53CD\u5411\u9023\u7D50",noBacklinksFound:"\u7121\u6CD5\u627E\u5230\u53CD\u5411\u9023\u7D50"},themeToggle:{lightMode:"\u4EAE\u8272\u6A21\u5F0F",darkMode:"\u6697\u8272\u6A21\u5F0F"},readerMode:{title:"\u95B1\u8B80\u6A21\u5F0F"},explorer:{title:"\u63A2\u7D22"},footer:{createdWith:"Created with"},graph:{title:"\u95DC\u4FC2\u5716\u8B5C"},recentNotes:{title:"\u6700\u8FD1\u7684\u7B46\u8A18",seeRemainingMore:__name(({remaining})=>`\u67E5\u770B\u66F4\u591A ${remaining} \u7BC7\u7B46\u8A18 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u5305\u542B ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u6307\u5411\u539F\u59CB\u7B46\u8A18\u7684\u9023\u7D50"},search:{title:"\u641C\u5C0B",searchBarPlaceholder:"\u641C\u5C0B\u4E9B\u4EC0\u9EBC"},tableOfContents:{title:"\u76EE\u9304"},contentMeta:{readingTime:__name(({minutes})=>`\u95B1\u8B80\u6642\u9593\u7D04 ${minutes} \u5206\u9418`,"readingTime")}},pages:{rss:{recentNotes:"\u6700\u8FD1\u7684\u7B46\u8A18",lastFewNotes:__name(({count})=>`\u6700\u8FD1\u7684 ${count} \u689D\u7B46\u8A18`,"lastFewNotes")},error:{title:"\u7121\u6CD5\u627E\u5230",notFound:"\u79C1\u4EBA\u7B46\u8A18\u6216\u7B46\u8A18\u4E0D\u5B58\u5728\u3002",home:"\u8FD4\u56DE\u9996\u9801"},folderContent:{folder:"\u8CC7\u6599\u593E",itemsUnderFolder:__name(({count})=>`\u6B64\u8CC7\u6599\u593E\u4E0B\u6709 ${count} \u689D\u7B46\u8A18\u3002`,"itemsUnderFolder")},tagContent:{tag:"\u6A19\u7C64",tagIndex:"\u6A19\u7C64\u7D22\u5F15",itemsUnderTag:__name(({count})=>`\u6B64\u6A19\u7C64\u4E0B\u6709 ${count} \u689D\u7B46\u8A18\u3002`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u986F\u793A\u524D ${count} \u500B\u6A19\u7C64\u3002`,"showingFirst"),totalTags:__name(({count})=>`\u7E3D\u5171\u6709 ${count} \u500B\u6A19\u7C64\u3002`,"totalTags")}}};var vi_VN_default={propertyDefaults:{title:"Kh\xF4ng c\xF3 ti\xEAu \u0111\u1EC1",description:"Kh\xF4ng c\xF3 m\xF4 t\u1EA3"},components:{callout:{note:"Ghi ch\xFA",abstract:"T\u1ED5ng quan",info:"Th\xF4ng tin",todo:"C\u1EA7n ph\u1EA3i l\xE0m",tip:"G\u1EE3i \xFD",success:"Th\xE0nh c\xF4ng",question:"C\xE2u h\u1ECFi",warning:"C\u1EA3nh b\xE1o",failure:"Th\u1EA5t b\u1EA1i",danger:"Nguy hi\u1EC3m",bug:"L\u1ED7i",example:"V\xED d\u1EE5",quote:"Tr\xEDch d\u1EABn"},backlinks:{title:"Li\xEAn k\u1EBFt ng\u01B0\u1EE3c",noBacklinksFound:"Kh\xF4ng c\xF3 li\xEAn k\u1EBFt ng\u01B0\u1EE3c n\xE0o"},themeToggle:{lightMode:"Ch\u1EBF \u0111\u1ED9 s\xE1ng",darkMode:"Ch\u1EBF \u0111\u1ED9 t\u1ED1i"},readerMode:{title:"Ch\u1EBF \u0111\u1ED9 \u0111\u1ECDc"},explorer:{title:"N\u1ED9i dung"},footer:{createdWith:"\u0110\u01B0\u1EE3c t\u1EA1o b\u1EB1ng"},graph:{title:"S\u01A1 \u0111\u1ED3"},recentNotes:{title:"Ghi ch\xFA g\u1EA7n \u0111\xE2y",seeRemainingMore:__name(({remaining})=>`Xem th\xEAm ${remaining} ghi ch\xFA \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Tr\xEDch d\u1EABn to\xE0n b\u1ED9 t\u1EEB ${targetSlug}`,"transcludeOf"),linkToOriginal:"Xem trang g\u1ED1c"},search:{title:"T\xECm",searchBarPlaceholder:"T\xECm ki\u1EBFm th\xF4ng tin"},tableOfContents:{title:"M\u1EE5c l\u1EE5c"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} ph\xFAt \u0111\u1ECDc`,"readingTime")}},pages:{rss:{recentNotes:"Ghi ch\xFA g\u1EA7n \u0111\xE2y",lastFewNotes:__name(({count})=>`${count} Trang g\u1EA7n \u0111\xE2y`,"lastFewNotes")},error:{title:"Kh\xF4ng t\xECm th\u1EA5y",notFound:"Trang n\xE0y ri\xEAng t\u01B0 ho\u1EB7c kh\xF4ng t\u1ED3n t\u1EA1i.",home:"V\u1EC1 trang ch\u1EE7"},folderContent:{folder:"Th\u01B0 m\u1EE5c",itemsUnderFolder:__name(({count})=>`C\xF3 ${count} trang trong th\u01B0 m\u1EE5c n\xE0y.`,"itemsUnderFolder")},tagContent:{tag:"Th\u1EBB",tagIndex:"Danh s\xE1ch th\u1EBB",itemsUnderTag:__name(({count})=>`C\xF3 ${count} trang g\u1EAFn th\u1EBB n\xE0y.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0110ang hi\u1EC3n th\u1ECB ${count} trang \u0111\u1EA7u ti\xEAn.`,"showingFirst"),totalTags:__name(({count})=>`C\xF3 t\u1ED5ng c\u1ED9ng ${count} th\u1EBB.`,"totalTags")}}};var pt_BR_default={propertyDefaults:{title:"Sem t\xEDtulo",description:"Sem descri\xE7\xE3o"},components:{callout:{note:"Nota",abstract:"Abstrato",info:"Info",todo:"Pend\xEAncia",tip:"Dica",success:"Sucesso",question:"Pergunta",warning:"Aviso",failure:"Falha",danger:"Perigo",bug:"Bug",example:"Exemplo",quote:"Cita\xE7\xE3o"},backlinks:{title:"Backlinks",noBacklinksFound:"Sem backlinks encontrados"},themeToggle:{lightMode:"Tema claro",darkMode:"Tema escuro"},readerMode:{title:"Modo leitor"},explorer:{title:"Explorador"},footer:{createdWith:"Criado com"},graph:{title:"Vis\xE3o de gr\xE1fico"},recentNotes:{title:"Notas recentes",seeRemainingMore:__name(({remaining})=>`Veja mais ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transcrever de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link ao original"},search:{title:"Pesquisar",searchBarPlaceholder:"Pesquisar por algo"},tableOfContents:{title:"Sum\xE1rio"},contentMeta:{readingTime:__name(({minutes})=>`Leitura de ${minutes} min`,"readingTime")}},pages:{rss:{recentNotes:"Notas recentes",lastFewNotes:__name(({count})=>`\xDAltimas ${count} notas`,"lastFewNotes")},error:{title:"N\xE3o encontrado",notFound:"Esta p\xE1gina \xE9 privada ou n\xE3o existe.",home:"Retornar a p\xE1gina inicial"},folderContent:{folder:"Arquivo",itemsUnderFolder:__name(({count})=>count===1?"1 item neste arquivo.":`${count} items neste arquivo.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Sum\xE1rio de Tags",itemsUnderTag:__name(({count})=>count===1?"1 item com esta tag.":`${count} items com esta tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Mostrando as ${count} primeiras tags.`,"showingFirst"),totalTags:__name(({count})=>`Encontradas ${count} tags.`,"totalTags")}}};var hu_HU_default={propertyDefaults:{title:"N\xE9vtelen",description:"Nincs le\xEDr\xE1s"},components:{callout:{note:"Jegyzet",abstract:"Abstract",info:"Inform\xE1ci\xF3",todo:"Tennival\xF3",tip:"Tipp",success:"Siker",question:"K\xE9rd\xE9s",warning:"Figyelmeztet\xE9s",failure:"Hiba",danger:"Vesz\xE9ly",bug:"Bug",example:"P\xE9lda",quote:"Id\xE9zet"},backlinks:{title:"Visszautal\xE1sok",noBacklinksFound:"Nincs visszautal\xE1s"},themeToggle:{lightMode:"Vil\xE1gos m\xF3d",darkMode:"S\xF6t\xE9t m\xF3d"},readerMode:{title:"Olvas\xF3 m\xF3d"},explorer:{title:"F\xE1jlb\xF6ng\xE9sz\u0151"},footer:{createdWith:"K\xE9sz\xEDtve ezzel:"},graph:{title:"Grafikonn\xE9zet"},recentNotes:{title:"Legut\xF3bbi jegyzetek",seeRemainingMore:__name(({remaining})=>`${remaining} tov\xE1bbi megtekint\xE9se \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug} \xE1thivatkoz\xE1sa`,"transcludeOf"),linkToOriginal:"Hivatkoz\xE1s az eredetire"},search:{title:"Keres\xE9s",searchBarPlaceholder:"Keress valamire"},tableOfContents:{title:"Tartalomjegyz\xE9k"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} perces olvas\xE1s`,"readingTime")}},pages:{rss:{recentNotes:"Legut\xF3bbi jegyzetek",lastFewNotes:__name(({count})=>`Legut\xF3bbi ${count} jegyzet`,"lastFewNotes")},error:{title:"Nem tal\xE1lhat\xF3",notFound:"Ez a lap vagy priv\xE1t vagy nem l\xE9tezik.",home:"Vissza a kezd\u0151lapra"},folderContent:{folder:"Mappa",itemsUnderFolder:__name(({count})=>`Ebben a mapp\xE1ban ${count} elem tal\xE1lhat\xF3.`,"itemsUnderFolder")},tagContent:{tag:"C\xEDmke",tagIndex:"C\xEDmke index",itemsUnderTag:__name(({count})=>`${count} elem tal\xE1lhat\xF3 ezzel a c\xEDmk\xE9vel.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Els\u0151 ${count} c\xEDmke megjelen\xEDtve.`,"showingFirst"),totalTags:__name(({count})=>`\xD6sszesen ${count} c\xEDmke tal\xE1lhat\xF3.`,"totalTags")}}};var fa_IR_default={propertyDefaults:{title:"\u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646",description:"\u062A\u0648\u0636\u06CC\u062D \u062E\u0627\u0635\u06CC \u0627\u0636\u0627\u0641\u0647 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A"},direction:"rtl",components:{callout:{note:"\u06CC\u0627\u062F\u062F\u0627\u0634\u062A",abstract:"\u0686\u06A9\u06CC\u062F\u0647",info:"\u0627\u0637\u0644\u0627\u0639\u0627\u062A",todo:"\u0627\u0642\u062F\u0627\u0645",tip:"\u0646\u06A9\u062A\u0647",success:"\u062A\u06CC\u06A9",question:"\u0633\u0624\u0627\u0644",warning:"\u0647\u0634\u062F\u0627\u0631",failure:"\u0634\u06A9\u0633\u062A",danger:"\u062E\u0637\u0631",bug:"\u0628\u0627\u06AF",example:"\u0645\u062B\u0627\u0644",quote:"\u0646\u0642\u0644 \u0642\u0648\u0644"},backlinks:{title:"\u0628\u06A9\u200C\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627",noBacklinksFound:"\u0628\u062F\u0648\u0646 \u0628\u06A9\u200C\u0644\u06CC\u0646\u06A9"},themeToggle:{lightMode:"\u062D\u0627\u0644\u062A \u0631\u0648\u0634\u0646",darkMode:"\u062D\u0627\u0644\u062A \u062A\u0627\u0631\u06CC\u06A9"},readerMode:{title:"\u062D\u0627\u0644\u062A \u062E\u0648\u0627\u0646\u062F\u0646"},explorer:{title:"\u0645\u0637\u0627\u0644\u0628"},footer:{createdWith:"\u0633\u0627\u062E\u062A\u0647 \u0634\u062F\u0647 \u0628\u0627"},graph:{title:"\u0646\u0645\u0627\u06CC \u06AF\u0631\u0627\u0641"},recentNotes:{title:"\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631",seeRemainingMore:__name(({remaining})=>`${remaining} \u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u062F\u06CC\u06AF\u0631 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0627\u0632 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u067E\u06CC\u0648\u0646\u062F \u0628\u0647 \u0627\u0635\u0644\u06CC"},search:{title:"\u062C\u0633\u062A\u062C\u0648",searchBarPlaceholder:"\u0645\u0637\u0644\u0628\u06CC \u0631\u0627 \u062C\u0633\u062A\u062C\u0648 \u06A9\u0646\u06CC\u062F"},tableOfContents:{title:"\u0641\u0647\u0631\u0633\u062A"},contentMeta:{readingTime:__name(({minutes})=>`\u0632\u0645\u0627\u0646 \u062A\u0642\u0631\u06CC\u0628\u06CC \u0645\u0637\u0627\u0644\u0639\u0647: ${minutes} \u062F\u0642\u06CC\u0642\u0647`,"readingTime")}},pages:{rss:{recentNotes:"\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631",lastFewNotes:__name(({count})=>`${count} \u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u0627\u062E\u06CC\u0631`,"lastFewNotes")},error:{title:"\u06CC\u0627\u0641\u062A \u0646\u0634\u062F",notFound:"\u0627\u06CC\u0646 \u0635\u0641\u062D\u0647 \u06CC\u0627 \u062E\u0635\u0648\u0635\u06CC \u0627\u0633\u062A \u06CC\u0627 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F",home:"\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC"},folderContent:{folder:"\u067E\u0648\u0634\u0647",itemsUnderFolder:__name(({count})=>count===1?".\u06CC\u06A9 \u0645\u0637\u0644\u0628 \u062F\u0631 \u0627\u06CC\u0646 \u067E\u0648\u0634\u0647 \u0627\u0633\u062A":`${count} \u0645\u0637\u0644\u0628 \u062F\u0631 \u0627\u06CC\u0646 \u067E\u0648\u0634\u0647 \u0627\u0633\u062A.`,"itemsUnderFolder")},tagContent:{tag:"\u0628\u0631\u0686\u0633\u0628",tagIndex:"\u0641\u0647\u0631\u0633\u062A \u0628\u0631\u0686\u0633\u0628\u200C\u0647\u0627",itemsUnderTag:__name(({count})=>count===1?"\u06CC\u06A9 \u0645\u0637\u0644\u0628 \u0628\u0627 \u0627\u06CC\u0646 \u0628\u0631\u0686\u0633\u0628":`${count} \u0645\u0637\u0644\u0628 \u0628\u0627 \u0627\u06CC\u0646 \u0628\u0631\u0686\u0633\u0628.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u062F\u0631 \u062D\u0627\u0644 \u0646\u0645\u0627\u06CC\u0634 ${count} \u0628\u0631\u0686\u0633\u0628.`,"showingFirst"),totalTags:__name(({count})=>`${count} \u0628\u0631\u0686\u0633\u0628 \u06CC\u0627\u0641\u062A \u0634\u062F.`,"totalTags")}}};var pl_PL_default={propertyDefaults:{title:"Bez nazwy",description:"Brak opisu"},components:{callout:{note:"Notatka",abstract:"Streszczenie",info:"informacja",todo:"Do zrobienia",tip:"Wskaz\xF3wka",success:"Zrobione",question:"Pytanie",warning:"Ostrze\u017Cenie",failure:"Usterka",danger:"Niebiezpiecze\u0144stwo",bug:"B\u0142\u0105d w kodzie",example:"Przyk\u0142ad",quote:"Cytat"},backlinks:{title:"Odno\u015Bniki zwrotne",noBacklinksFound:"Brak po\u0142\u0105cze\u0144 zwrotnych"},themeToggle:{lightMode:"Trzyb jasny",darkMode:"Tryb ciemny"},readerMode:{title:"Tryb czytania"},explorer:{title:"Przegl\u0105daj"},footer:{createdWith:"Stworzone z u\u017Cyciem"},graph:{title:"Graf"},recentNotes:{title:"Najnowsze notatki",seeRemainingMore:__name(({remaining})=>`Zobacz ${remaining} nastepnych \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Osadzone ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0141\u0105cze do orygina\u0142u"},search:{title:"Szukaj",searchBarPlaceholder:"Wpisz fraz\u0119 wyszukiwania"},tableOfContents:{title:"Spis tre\u015Bci"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min. czytania `,"readingTime")}},pages:{rss:{recentNotes:"Najnowsze notatki",lastFewNotes:__name(({count})=>`Ostatnie ${count} notatek`,"lastFewNotes")},error:{title:"Nie znaleziono",notFound:"Ta strona jest prywatna lub nie istnieje.",home:"Powr\xF3t do strony g\u0142\xF3wnej"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"W tym folderze jest 1 element.":`Element\xF3w w folderze: ${count}.`,"itemsUnderFolder")},tagContent:{tag:"Znacznik",tagIndex:"Spis znacznik\xF3w",itemsUnderTag:__name(({count})=>count===1?"Oznaczony 1 element.":`Element\xF3w z tym znacznikiem: ${count}.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Pokazuje ${count} pierwszych znacznik\xF3w.`,"showingFirst"),totalTags:__name(({count})=>`Znalezionych wszystkich znacznik\xF3w: ${count}.`,"totalTags")}}};var cs_CZ_default={propertyDefaults:{title:"Bez n\xE1zvu",description:"Nebyl uveden \u017E\xE1dn\xFD popis"},components:{callout:{note:"Pozn\xE1mka",abstract:"Abstract",info:"Info",todo:"Todo",tip:"Tip",success:"\xDAsp\u011Bch",question:"Ot\xE1zka",warning:"Upozorn\u011Bn\xED",failure:"Chyba",danger:"Nebezpe\u010D\xED",bug:"Bug",example:"P\u0159\xEDklad",quote:"Citace"},backlinks:{title:"P\u0159\xEDchoz\xED odkazy",noBacklinksFound:"Nenalezeny \u017E\xE1dn\xE9 p\u0159\xEDchoz\xED odkazy"},themeToggle:{lightMode:"Sv\u011Btl\xFD re\u017Eim",darkMode:"Tmav\xFD re\u017Eim"},readerMode:{title:"Re\u017Eim \u010Dte\u010Dky"},explorer:{title:"Proch\xE1zet"},footer:{createdWith:"Vytvo\u0159eno pomoc\xED"},graph:{title:"Graf"},recentNotes:{title:"Nejnov\u011Bj\u0161\xED pozn\xE1mky",seeRemainingMore:__name(({remaining})=>`Zobraz ${remaining} dal\u0161\xEDch \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Zobrazen\xED ${targetSlug}`,"transcludeOf"),linkToOriginal:"Odkaz na p\u016Fvodn\xED dokument"},search:{title:"Hledat",searchBarPlaceholder:"Hledejte n\u011Bco"},tableOfContents:{title:"Obsah"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min \u010Dten\xED`,"readingTime")}},pages:{rss:{recentNotes:"Nejnov\u011Bj\u0161\xED pozn\xE1mky",lastFewNotes:__name(({count})=>`Posledn\xEDch ${count} pozn\xE1mek`,"lastFewNotes")},error:{title:"Nenalezeno",notFound:"Tato str\xE1nka je bu\u010F soukrom\xE1, nebo neexistuje.",home:"N\xE1vrat na domovskou str\xE1nku"},folderContent:{folder:"Slo\u017Eka",itemsUnderFolder:__name(({count})=>count===1?"1 polo\u017Eka v t\xE9to slo\u017Ece.":`${count} polo\u017Eek v t\xE9to slo\u017Ece.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Rejst\u0159\xEDk tag\u016F",itemsUnderTag:__name(({count})=>count===1?"1 polo\u017Eka s t\xEDmto tagem.":`${count} polo\u017Eek s t\xEDmto tagem.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Zobrazuj\xED se prvn\xED ${count} tagy.`,"showingFirst"),totalTags:__name(({count})=>`Nalezeno celkem ${count} tag\u016F.`,"totalTags")}}};var tr_TR_default={propertyDefaults:{title:"\u0130simsiz",description:"Herhangi bir a\xE7\u0131klama eklenmedi"},components:{callout:{note:"Not",abstract:"\xD6zet",info:"Bilgi",todo:"Yap\u0131lacaklar",tip:"\u0130pucu",success:"Ba\u015Far\u0131l\u0131",question:"Soru",warning:"Uyar\u0131",failure:"Ba\u015Far\u0131s\u0131z",danger:"Tehlike",bug:"Hata",example:"\xD6rnek",quote:"Al\u0131nt\u0131"},backlinks:{title:"Backlinkler",noBacklinksFound:"Backlink bulunamad\u0131"},themeToggle:{lightMode:"A\xE7\u0131k mod",darkMode:"Koyu mod"},readerMode:{title:"Okuma modu"},explorer:{title:"Gezgin"},footer:{createdWith:"\u015Eununla olu\u015Fturuldu"},graph:{title:"Grafik G\xF6r\xFCn\xFCm\xFC"},recentNotes:{title:"Son Notlar",seeRemainingMore:__name(({remaining})=>`${remaining} tane daha g\xF6r \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug} sayfas\u0131ndan al\u0131nt\u0131`,"transcludeOf"),linkToOriginal:"Orijinal ba\u011Flant\u0131"},search:{title:"Arama",searchBarPlaceholder:"Bir \u015Fey aray\u0131n"},tableOfContents:{title:"\u0130\xE7indekiler"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} dakika okuma s\xFCresi`,"readingTime")}},pages:{rss:{recentNotes:"Son notlar",lastFewNotes:__name(({count})=>`Son ${count} not`,"lastFewNotes")},error:{title:"Bulunamad\u0131",notFound:"Bu sayfa ya \xF6zel ya da mevcut de\u011Fil.",home:"Anasayfaya geri d\xF6n"},folderContent:{folder:"Klas\xF6r",itemsUnderFolder:__name(({count})=>count===1?"Bu klas\xF6r alt\u0131nda 1 \xF6\u011Fe.":`Bu klas\xF6r alt\u0131ndaki ${count} \xF6\u011Fe.`,"itemsUnderFolder")},tagContent:{tag:"Etiket",tagIndex:"Etiket S\u0131ras\u0131",itemsUnderTag:__name(({count})=>count===1?"Bu etikete sahip 1 \xF6\u011Fe.":`Bu etiket alt\u0131ndaki ${count} \xF6\u011Fe.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0130lk ${count} etiket g\xF6steriliyor.`,"showingFirst"),totalTags:__name(({count})=>`Toplam ${count} adet etiket bulundu.`,"totalTags")}}};var th_TH_default={propertyDefaults:{title:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E0A\u0E37\u0E48\u0E2D",description:"\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E30\u0E1A\u0E38\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E22\u0E48\u0E2D"},components:{callout:{note:"\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38",abstract:"\u0E1A\u0E17\u0E04\u0E31\u0E14\u0E22\u0E48\u0E2D",info:"\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",todo:"\u0E15\u0E49\u0E2D\u0E07\u0E17\u0E33\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21",tip:"\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33",success:"\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22",question:"\u0E04\u0E33\u0E16\u0E32\u0E21",warning:"\u0E04\u0E33\u0E40\u0E15\u0E37\u0E2D\u0E19",failure:"\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14",danger:"\u0E2D\u0E31\u0E19\u0E15\u0E23\u0E32\u0E22",bug:"\u0E1A\u0E31\u0E4A\u0E01",example:"\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07",quote:"\u0E04\u0E33\u0E1E\u0E39\u0E01\u0E22\u0E01\u0E21\u0E32"},backlinks:{title:"\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E01\u0E25\u0E48\u0E32\u0E27\u0E16\u0E36\u0E07",noBacklinksFound:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E42\u0E22\u0E07\u0E21\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49"},themeToggle:{lightMode:"\u0E42\u0E2B\u0E21\u0E14\u0E2A\u0E27\u0E48\u0E32\u0E07",darkMode:"\u0E42\u0E2B\u0E21\u0E14\u0E21\u0E37\u0E14"},readerMode:{title:"\u0E42\u0E2B\u0E21\u0E14\u0E2D\u0E48\u0E32\u0E19"},explorer:{title:"\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2B\u0E19\u0E49\u0E32"},footer:{createdWith:"\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E14\u0E49\u0E27\u0E22"},graph:{title:"\u0E21\u0E38\u0E21\u0E21\u0E2D\u0E07\u0E01\u0E23\u0E32\u0E1F"},recentNotes:{title:"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14",seeRemainingMore:__name(({remaining})=>`\u0E14\u0E39\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2D\u0E35\u0E01 ${remaining} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0E23\u0E27\u0E21\u0E02\u0E49\u0E32\u0E21\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32\u0E08\u0E32\u0E01 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0E14\u0E39\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E49\u0E19\u0E17\u0E32\u0E07"},search:{title:"\u0E04\u0E49\u0E19\u0E2B\u0E32",searchBarPlaceholder:"\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E1A\u0E32\u0E07\u0E2D\u0E22\u0E48\u0E32\u0E07"},tableOfContents:{title:"\u0E2A\u0E32\u0E23\u0E1A\u0E31\u0E0D"},contentMeta:{readingTime:__name(({minutes})=>`\u0E2D\u0E48\u0E32\u0E19\u0E23\u0E32\u0E27 ${minutes} \u0E19\u0E32\u0E17\u0E35`,"readingTime")}},pages:{rss:{recentNotes:"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14",lastFewNotes:__name(({count})=>`${count} \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14`,"lastFewNotes")},error:{title:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49",notFound:"\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49\u0E2D\u0E32\u0E08\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27\u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E2A\u0E23\u0E49\u0E32\u0E07",home:"\u0E01\u0E25\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01"},folderContent:{folder:"\u0E42\u0E1F\u0E25\u0E40\u0E14\u0E2D\u0E23\u0E4C",itemsUnderFolder:__name(({count})=>`\u0E21\u0E35 ${count} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E19\u0E42\u0E1F\u0E25\u0E40\u0E14\u0E2D\u0E23\u0E4C\u0E19\u0E35\u0E49`,"itemsUnderFolder")},tagContent:{tag:"\u0E41\u0E17\u0E47\u0E01",tagIndex:"\u0E41\u0E17\u0E47\u0E01\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",itemsUnderTag:__name(({count})=>`\u0E21\u0E35 ${count} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E19\u0E41\u0E17\u0E47\u0E01\u0E19\u0E35\u0E49`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0E41\u0E2A\u0E14\u0E07 ${count} \u0E41\u0E17\u0E47\u0E01\u0E41\u0E23\u0E01`,"showingFirst"),totalTags:__name(({count})=>`\u0E21\u0E35\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 ${count} \u0E41\u0E17\u0E47\u0E01`,"totalTags")}}};var lt_LT_default={propertyDefaults:{title:"Be Pavadinimo",description:"Apra\u0161ymas Nepateiktas"},components:{callout:{note:"Pastaba",abstract:"Santrauka",info:"Informacija",todo:"Darb\u0173 s\u0105ra\u0161as",tip:"Patarimas",success:"S\u0117kmingas",question:"Klausimas",warning:"\u012Esp\u0117jimas",failure:"Nes\u0117kmingas",danger:"Pavojus",bug:"Klaida",example:"Pavyzdys",quote:"Citata"},backlinks:{title:"Atgalin\u0117s Nuorodos",noBacklinksFound:"Atgalini\u0173 Nuorod\u0173 Nerasta"},themeToggle:{lightMode:"\u0160viesus Re\u017Eimas",darkMode:"Tamsus Re\u017Eimas"},readerMode:{title:"Modalit\xE0 lettore"},explorer:{title:"Nar\u0161ykl\u0117"},footer:{createdWith:"Sukurta Su"},graph:{title:"Grafiko Vaizdas"},recentNotes:{title:"Naujausi U\u017Era\u0161ai",seeRemainingMore:__name(({remaining})=>`Per\u017Ei\u016Br\u0117ti dar ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u012Eterpimas i\u0161 ${targetSlug}`,"transcludeOf"),linkToOriginal:"Nuoroda \u012F original\u0105"},search:{title:"Paie\u0161ka",searchBarPlaceholder:"Ie\u0161koti"},tableOfContents:{title:"Turinys"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min skaitymo`,"readingTime")}},pages:{rss:{recentNotes:"Naujausi u\u017Era\u0161ai",lastFewNotes:__name(({count})=>count===1?"Paskutinis 1 u\u017Era\u0161as":count<10?`Paskutiniai ${count} u\u017Era\u0161ai`:`Paskutiniai ${count} u\u017Era\u0161\u0173`,"lastFewNotes")},error:{title:"Nerasta",notFound:"Arba \u0161is puslapis yra pasiekiamas tik tam tikriems vartotojams, arba tokio puslapio n\u0117ra.",home:"Gr\u012F\u017Eti \u012F pagrindin\u012F puslap\u012F"},folderContent:{folder:"Aplankas",itemsUnderFolder:__name(({count})=>count===1?"1 elementas \u0161iame aplanke.":count<10?`${count} elementai \u0161iame aplanke.`:`${count} element\u0173 \u0161iame aplanke.`,"itemsUnderFolder")},tagContent:{tag:"\u017Dyma",tagIndex:"\u017Dym\u0173 indeksas",itemsUnderTag:__name(({count})=>count===1?"1 elementas su \u0161ia \u017Eyma.":count<10?`${count} elementai su \u0161ia \u017Eyma.`:`${count} element\u0173 su \u0161ia \u017Eyma.`,"itemsUnderTag"),showingFirst:__name(({count})=>count<10?`Rodomos pirmosios ${count} \u017Eymos.`:`Rodomos pirmosios ${count} \u017Eym\u0173.`,"showingFirst"),totalTags:__name(({count})=>count===1?"Rasta i\u0161 viso 1 \u017Eyma.":count<10?`Rasta i\u0161 viso ${count} \u017Eymos.`:`Rasta i\u0161 viso ${count} \u017Eym\u0173.`,"totalTags")}}};var fi_FI_default={propertyDefaults:{title:"Nimet\xF6n",description:"Ei kuvausta saatavilla"},components:{callout:{note:"Merkint\xE4",abstract:"Tiivistelm\xE4",info:"Info",todo:"Teht\xE4v\xE4lista",tip:"Vinkki",success:"Onnistuminen",question:"Kysymys",warning:"Varoitus",failure:"Ep\xE4onnistuminen",danger:"Vaara",bug:"Virhe",example:"Esimerkki",quote:"Lainaus"},backlinks:{title:"Takalinkit",noBacklinksFound:"Takalinkkej\xE4 ei l\xF6ytynyt"},themeToggle:{lightMode:"Vaalea tila",darkMode:"Tumma tila"},readerMode:{title:"Lukijatila"},explorer:{title:"Selain"},footer:{createdWith:"Luotu k\xE4ytt\xE4en"},graph:{title:"Verkkon\xE4kym\xE4"},recentNotes:{title:"Viimeisimm\xE4t muistiinpanot",seeRemainingMore:__name(({remaining})=>`N\xE4yt\xE4 ${remaining} lis\xE4\xE4 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Upote kohteesta ${targetSlug}`,"transcludeOf"),linkToOriginal:"Linkki alkuper\xE4iseen"},search:{title:"Haku",searchBarPlaceholder:"Hae jotain"},tableOfContents:{title:"Sis\xE4llysluettelo"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min lukuaika`,"readingTime")}},pages:{rss:{recentNotes:"Viimeisimm\xE4t muistiinpanot",lastFewNotes:__name(({count})=>`Viimeiset ${count} muistiinpanoa`,"lastFewNotes")},error:{title:"Ei l\xF6ytynyt",notFound:"T\xE4m\xE4 sivu on joko yksityinen tai sit\xE4 ei ole olemassa.",home:"Palaa etusivulle"},folderContent:{folder:"Kansio",itemsUnderFolder:__name(({count})=>count===1?"1 kohde t\xE4ss\xE4 kansiossa.":`${count} kohdetta t\xE4ss\xE4 kansiossa.`,"itemsUnderFolder")},tagContent:{tag:"Tunniste",tagIndex:"Tunnisteluettelo",itemsUnderTag:__name(({count})=>count===1?"1 kohde t\xE4ll\xE4 tunnisteella.":`${count} kohdetta t\xE4ll\xE4 tunnisteella.`,"itemsUnderTag"),showingFirst:__name(({count})=>`N\xE4ytet\xE4\xE4n ensimm\xE4iset ${count} tunnistetta.`,"showingFirst"),totalTags:__name(({count})=>`L\xF6ytyi yhteens\xE4 ${count} tunnistetta.`,"totalTags")}}};var nb_NO_default={propertyDefaults:{title:"Uten navn",description:"Ingen beskrivelse angitt"},components:{callout:{note:"Notis",abstract:"Abstrakt",info:"Info",todo:"Husk p\xE5",tip:"Tips",success:"Suksess",question:"Sp\xF8rsm\xE5l",warning:"Advarsel",failure:"Feil",danger:"Farlig",bug:"Bug",example:"Eksempel",quote:"Sitat"},backlinks:{title:"Tilbakekoblinger",noBacklinksFound:"Ingen tilbakekoblinger funnet"},themeToggle:{lightMode:"Lys modus",darkMode:"M\xF8rk modus"},readerMode:{title:"L\xE6semodus"},explorer:{title:"Utforsker"},footer:{createdWith:"Laget med"},graph:{title:"Graf-visning"},recentNotes:{title:"Nylige notater",seeRemainingMore:__name(({remaining})=>`Se ${remaining} til \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transkludering of ${targetSlug}`,"transcludeOf"),linkToOriginal:"Lenke til original"},search:{title:"S\xF8k",searchBarPlaceholder:"S\xF8k etter noe"},tableOfContents:{title:"Oversikt"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min lesning`,"readingTime")}},pages:{rss:{recentNotes:"Nylige notat",lastFewNotes:__name(({count})=>`Siste ${count} notat`,"lastFewNotes")},error:{title:"Ikke funnet",notFound:"Enten er denne siden privat eller s\xE5 finnes den ikke.",home:"Returner til hovedsiden"},folderContent:{folder:"Mappe",itemsUnderFolder:__name(({count})=>count===1?"1 gjenstand i denne mappen.":`${count} gjenstander i denne mappen.`,"itemsUnderFolder")},tagContent:{tag:"Tagg",tagIndex:"Tagg Indeks",itemsUnderTag:__name(({count})=>count===1?"1 gjenstand med denne taggen.":`${count} gjenstander med denne taggen.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Viser f\xF8rste ${count} tagger.`,"showingFirst"),totalTags:__name(({count})=>`Fant totalt ${count} tagger.`,"totalTags")}}};var id_ID_default={propertyDefaults:{title:"Tanpa Judul",description:"Tidak ada deskripsi"},components:{callout:{note:"Catatan",abstract:"Abstrak",info:"Info",todo:"Daftar Tugas",tip:"Tips",success:"Berhasil",question:"Pertanyaan",warning:"Peringatan",failure:"Gagal",danger:"Bahaya",bug:"Bug",example:"Contoh",quote:"Kutipan"},backlinks:{title:"Tautan Balik",noBacklinksFound:"Tidak ada tautan balik ditemukan"},themeToggle:{lightMode:"Mode Terang",darkMode:"Mode Gelap"},readerMode:{title:"Mode Pembaca"},explorer:{title:"Penjelajah"},footer:{createdWith:"Dibuat dengan"},graph:{title:"Tampilan Grafik"},recentNotes:{title:"Catatan Terbaru",seeRemainingMore:__name(({remaining})=>`Lihat ${remaining} lagi \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transklusi dari ${targetSlug}`,"transcludeOf"),linkToOriginal:"Tautan ke asli"},search:{title:"Cari",searchBarPlaceholder:"Cari sesuatu"},tableOfContents:{title:"Daftar Isi"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} menit baca`,"readingTime")}},pages:{rss:{recentNotes:"Catatan terbaru",lastFewNotes:__name(({count})=>`${count} catatan terakhir`,"lastFewNotes")},error:{title:"Tidak Ditemukan",notFound:"Halaman ini bersifat privat atau tidak ada.",home:"Kembali ke Beranda"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"1 item di bawah folder ini.":`${count} item di bawah folder ini.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Indeks Tag",itemsUnderTag:__name(({count})=>count===1?"1 item dengan tag ini.":`${count} item dengan tag ini.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Menampilkan ${count} tag pertama.`,"showingFirst"),totalTags:__name(({count})=>`Ditemukan total ${count} tag.`,"totalTags")}}};var kk_KZ_default={propertyDefaults:{title:"\u0410\u0442\u0430\u0443\u0441\u044B\u0437",description:"\u0421\u0438\u043F\u0430\u0442\u0442\u0430\u043C\u0430 \u0431\u0435\u0440\u0456\u043B\u043C\u0435\u0433\u0435\u043D"},components:{callout:{note:"\u0415\u0441\u043A\u0435\u0440\u0442\u0443",abstract:"\u0410\u043D\u043D\u043E\u0442\u0430\u0446\u0438\u044F",info:"\u0410\u049B\u043F\u0430\u0440\u0430\u0442",todo:"\u0406\u0441\u0442\u0435\u0443 \u043A\u0435\u0440\u0435\u043A",tip:"\u041A\u0435\u04A3\u0435\u0441",success:"\u0421\u04D9\u0442\u0442\u0456\u043B\u0456\u043A",question:"\u0421\u04B1\u0440\u0430\u049B",warning:"\u0415\u0441\u043A\u0435\u0440\u0442\u0443",failure:"\u049A\u0430\u0442\u0435",danger:"\u049A\u0430\u0443\u0456\u043F",bug:"\u049A\u0430\u0442\u0435",example:"\u041C\u044B\u0441\u0430\u043B",quote:"\u0414\u04D9\u0439\u0435\u043A\u0441\u04E9\u0437"},backlinks:{title:"\u0410\u0440\u0442\u049B\u0430 \u0441\u0456\u043B\u0442\u0435\u043C\u0435\u043B\u0435\u0440",noBacklinksFound:"\u0410\u0440\u0442\u049B\u0430 \u0441\u0456\u043B\u0442\u0435\u043C\u0435\u043B\u0435\u0440 \u0442\u0430\u0431\u044B\u043B\u043C\u0430\u0434\u044B"},themeToggle:{lightMode:"\u0416\u0430\u0440\u044B\u049B \u0440\u0435\u0436\u0438\u043C\u0456",darkMode:"\u049A\u0430\u0440\u0430\u04A3\u0493\u044B \u0440\u0435\u0436\u0438\u043C"},readerMode:{title:"\u041E\u049B\u0443 \u0440\u0435\u0436\u0438\u043C\u0456"},explorer:{title:"\u0417\u0435\u0440\u0442\u0442\u0435\u0443\u0448\u0456"},footer:{createdWith:"\u049A\u04B1\u0440\u0430\u0441\u0442\u044B\u0440\u044B\u043B\u0493\u0430\u043D \u049B\u04B1\u0440\u0430\u043B:"},graph:{title:"\u0413\u0440\u0430\u0444 \u043A\u04E9\u0440\u0456\u043D\u0456\u0441\u0456"},recentNotes:{title:"\u0421\u043E\u04A3\u0493\u044B \u0436\u0430\u0437\u0431\u0430\u043B\u0430\u0440",seeRemainingMore:__name(({remaining})=>`\u0422\u0430\u0493\u044B ${remaining} \u0436\u0430\u0437\u0431\u0430\u043D\u044B \u049B\u0430\u0440\u0430\u0443 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug} \u043A\u0456\u0440\u0456\u0441\u0442\u0456\u0440\u0443`,"transcludeOf"),linkToOriginal:"\u0411\u0430\u0441\u0442\u0430\u043F\u049B\u044B\u0493\u0430 \u0441\u0456\u043B\u0442\u0435\u043C\u0435"},search:{title:"\u0406\u0437\u0434\u0435\u0443",searchBarPlaceholder:"\u0411\u0456\u0440\u0434\u0435\u04A3\u0435 \u0456\u0437\u0434\u0435\u0443"},tableOfContents:{title:"\u041C\u0430\u0437\u043C\u04B1\u043D\u044B"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} \u043C\u0438\u043D \u043E\u049B\u0443`,"readingTime")}},pages:{rss:{recentNotes:"\u0421\u043E\u04A3\u0493\u044B \u0436\u0430\u0437\u0431\u0430\u043B\u0430\u0440",lastFewNotes:__name(({count})=>`\u0421\u043E\u04A3\u0493\u044B ${count} \u0436\u0430\u0437\u0431\u0430`,"lastFewNotes")},error:{title:"\u0422\u0430\u0431\u044B\u043B\u043C\u0430\u0434\u044B",notFound:"\u0411\u04B1\u043B \u0431\u0435\u0442 \u0436\u0435\u043A\u0435 \u043D\u0435\u043C\u0435\u0441\u0435 \u0436\u043E\u049B \u0431\u043E\u043B\u0443\u044B \u043C\u04AF\u043C\u043A\u0456\u043D.",home:"\u0411\u0430\u0441\u0442\u044B \u0431\u0435\u0442\u043A\u0435 \u043E\u0440\u0430\u043B\u0443"},folderContent:{folder:"\u049A\u0430\u043B\u0442\u0430",itemsUnderFolder:__name(({count})=>count===1?"\u0411\u04B1\u043B \u049B\u0430\u043B\u0442\u0430\u0434\u0430 1 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0431\u0430\u0440.":`\u0411\u04B1\u043B \u049B\u0430\u043B\u0442\u0430\u0434\u0430 ${count} \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0431\u0430\u0440.`,"itemsUnderFolder")},tagContent:{tag:"\u0422\u0435\u0433",tagIndex:"\u0422\u0435\u0433\u0442\u0435\u0440 \u0438\u043D\u0434\u0435\u043A\u0441\u0456",itemsUnderTag:__name(({count})=>count===1?"\u0411\u04B1\u043B \u0442\u0435\u0433\u043F\u0435\u043D 1 \u044D\u043B\u0435\u043C\u0435\u043D\u0442.":`\u0411\u04B1\u043B \u0442\u0435\u0433\u043F\u0435\u043D ${count} \u044D\u043B\u0435\u043C\u0435\u043D\u0442.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0410\u043B\u0493\u0430\u0448\u049B\u044B ${count} \u0442\u0435\u0433 \u043A\u04E9\u0440\u0441\u0435\u0442\u0456\u043B\u0443\u0434\u0435.`,"showingFirst"),totalTags:__name(({count})=>`\u0411\u0430\u0440\u043B\u044B\u0493\u044B ${count} \u0442\u0435\u0433 \u0442\u0430\u0431\u044B\u043B\u0434\u044B.`,"totalTags")}}};var he_IL_default={propertyDefaults:{title:"\u05DC\u05DC\u05D0 \u05DB\u05D5\u05EA\u05E8\u05EA",description:"\u05DC\u05D0 \u05E1\u05D5\u05E4\u05E7 \u05EA\u05D9\u05D0\u05D5\u05E8"},direction:"rtl",components:{callout:{note:"\u05D4\u05E2\u05E8\u05D4",abstract:"\u05EA\u05E7\u05E6\u05D9\u05E8",info:"\u05DE\u05D9\u05D3\u05E2",todo:"\u05DC\u05E2\u05E9\u05D5\u05EA",tip:"\u05D8\u05D9\u05E4",success:"\u05D4\u05E6\u05DC\u05D7\u05D4",question:"\u05E9\u05D0\u05DC\u05D4",warning:"\u05D0\u05D6\u05D4\u05E8\u05D4",failure:"\u05DB\u05E9\u05DC\u05D5\u05DF",danger:"\u05E1\u05DB\u05E0\u05D4",bug:"\u05D1\u05D0\u05D2",example:"\u05D3\u05D5\u05D2\u05DE\u05D4",quote:"\u05E6\u05D9\u05D8\u05D5\u05D8"},backlinks:{title:"\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05D7\u05D5\u05D6\u05E8\u05D9\u05DD",noBacklinksFound:"\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05D7\u05D5\u05D6\u05E8\u05D9\u05DD"},themeToggle:{lightMode:"\u05DE\u05E6\u05D1 \u05D1\u05D4\u05D9\u05E8",darkMode:"\u05DE\u05E6\u05D1 \u05DB\u05D4\u05D4"},readerMode:{title:"\u05DE\u05E6\u05D1 \u05E7\u05E8\u05D9\u05D0\u05D4"},explorer:{title:"\u05E1\u05D9\u05D9\u05E8"},footer:{createdWith:"\u05E0\u05D5\u05E6\u05E8 \u05D1\u05D0\u05DE\u05E6\u05E2\u05D5\u05EA"},graph:{title:"\u05DE\u05D1\u05D8 \u05D2\u05E8\u05E3"},recentNotes:{title:"\u05D4\u05E2\u05E8\u05D5\u05EA \u05D0\u05D7\u05E8\u05D5\u05E0\u05D5\u05EA",seeRemainingMore:__name(({remaining})=>`\u05E2\u05D9\u05D9\u05DF \u05D1 ${remaining} \u05E0\u05D5\u05E1\u05E4\u05D9\u05DD \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u05DE\u05E6\u05D5\u05D8\u05D8 \u05DE ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u05E7\u05D9\u05E9\u05D5\u05E8 \u05DC\u05DE\u05E7\u05D5\u05E8\u05D9"},search:{title:"\u05D7\u05D9\u05E4\u05D5\u05E9",searchBarPlaceholder:"\u05D7\u05E4\u05E9\u05D5 \u05DE\u05E9\u05D4\u05D5"},tableOfContents:{title:"\u05EA\u05D5\u05DB\u05DF \u05E2\u05E0\u05D9\u05D9\u05E0\u05D9\u05DD"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} \u05D3\u05E7\u05D5\u05EA \u05E7\u05E8\u05D9\u05D0\u05D4`,"readingTime")}},pages:{rss:{recentNotes:"\u05D4\u05E2\u05E8\u05D5\u05EA \u05D0\u05D7\u05E8\u05D5\u05E0\u05D5\u05EA",lastFewNotes:__name(({count})=>`${count} \u05D4\u05E2\u05E8\u05D5\u05EA \u05D0\u05D7\u05E8\u05D5\u05E0\u05D5\u05EA`,"lastFewNotes")},error:{title:"\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0",notFound:"\u05D4\u05E2\u05DE\u05D5\u05D3 \u05D4\u05D6\u05D4 \u05E4\u05E8\u05D8\u05D9 \u05D0\u05D5 \u05DC\u05D0 \u05E7\u05D9\u05D9\u05DD.",home:"\u05D7\u05D6\u05E8\u05D4 \u05DC\u05E2\u05DE\u05D5\u05D3 \u05D4\u05D1\u05D9\u05EA"},folderContent:{folder:"\u05EA\u05D9\u05E7\u05D9\u05D9\u05D4",itemsUnderFolder:__name(({count})=>count===1?"\u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3 \u05EA\u05D7\u05EA \u05EA\u05D9\u05E7\u05D9\u05D9\u05D4 \u05D6\u05D5.":`${count} \u05E4\u05E8\u05D9\u05D8\u05D9\u05DD \u05EA\u05D7\u05EA \u05EA\u05D9\u05E7\u05D9\u05D9\u05D4 \u05D6\u05D5.`,"itemsUnderFolder")},tagContent:{tag:"\u05EA\u05D2\u05D9\u05EA",tagIndex:"\u05DE\u05E4\u05EA\u05D7 \u05D4\u05EA\u05D2\u05D9\u05D5\u05EA",itemsUnderTag:__name(({count})=>count===1?"\u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3 \u05E2\u05DD \u05EA\u05D2\u05D9\u05EA \u05D6\u05D5.":`${count} \u05E4\u05E8\u05D9\u05D8\u05D9\u05DD \u05E2\u05DD \u05EA\u05D2\u05D9\u05EA \u05D6\u05D5.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u05DE\u05E8\u05D0\u05D4 \u05D0\u05EA \u05D4-${count} \u05EA\u05D2\u05D9\u05D5\u05EA \u05D4\u05E8\u05D0\u05E9\u05D5\u05E0\u05D5\u05EA.`,"showingFirst"),totalTags:__name(({count})=>`${count} \u05EA\u05D2\u05D9\u05D5\u05EA \u05E0\u05DE\u05E6\u05D0\u05D5 \u05E1\u05DA \u05D4\u05DB\u05DC.`,"totalTags")}}};var TRANSLATIONS={"en-US":en_US_default,"en-GB":en_GB_default,"fr-FR":fr_FR_default,"it-IT":it_IT_default,"ja-JP":ja_JP_default,"de-DE":de_DE_default,"nl-NL":nl_NL_default,"nl-BE":nl_NL_default,"ro-RO":ro_RO_default,"ro-MD":ro_RO_default,"ca-ES":ca_ES_default,"es-ES":es_ES_default,"ar-SA":ar_SA_default,"ar-AE":ar_SA_default,"ar-QA":ar_SA_default,"ar-BH":ar_SA_default,"ar-KW":ar_SA_default,"ar-OM":ar_SA_default,"ar-YE":ar_SA_default,"ar-IR":ar_SA_default,"ar-SY":ar_SA_default,"ar-IQ":ar_SA_default,"ar-JO":ar_SA_default,"ar-PL":ar_SA_default,"ar-LB":ar_SA_default,"ar-EG":ar_SA_default,"ar-SD":ar_SA_default,"ar-LY":ar_SA_default,"ar-MA":ar_SA_default,"ar-TN":ar_SA_default,"ar-DZ":ar_SA_default,"ar-MR":ar_SA_default,"uk-UA":uk_UA_default,"ru-RU":ru_RU_default,"ko-KR":ko_KR_default,"zh-CN":zh_CN_default,"zh-TW":zh_TW_default,"vi-VN":vi_VN_default,"pt-BR":pt_BR_default,"hu-HU":hu_HU_default,"fa-IR":fa_IR_default,"pl-PL":pl_PL_default,"cs-CZ":cs_CZ_default,"tr-TR":tr_TR_default,"th-TH":th_TH_default,"lt-LT":lt_LT_default,"fi-FI":fi_FI_default,"nb-NO":nb_NO_default,"id-ID":id_ID_default,"kk-KZ":kk_KZ_default,"he-IL":he_IL_default},defaultTranslation="en-US",i18n=__name(locale=>TRANSLATIONS[locale??defaultTranslation],"i18n");var defaultOptions={delimiters:"---",language:"yaml"};function coalesceAliases(data,aliases){for(let alias of aliases)if(data[alias]!==void 0&&data[alias]!==null)return data[alias]}__name(coalesceAliases,"coalesceAliases");function coerceToArray(input){if(input!=null)return Array.isArray(input)||(input=input.toString().split(",").map(tag=>tag.trim())),input.filter(tag=>typeof tag=="string"||typeof tag=="number").map(tag=>tag.toString())}__name(coerceToArray,"coerceToArray");function getAliasSlugs(aliases){let res=[];for(let alias of aliases){let mockFp=getFileExtension(alias)==="md"?alias:alias+".md",slug=slugifyFilePath(mockFp);res.push(slug)}return res}__name(getAliasSlugs,"getAliasSlugs");var FrontMatter=__name(userOpts=>{let opts={...defaultOptions,...userOpts};return{name:"FrontMatter",markdownPlugins(ctx){let{cfg,allSlugs}=ctx;return[[remarkFrontmatter,["yaml","toml"]],()=>(_,file)=>{let fileData=Buffer.from(file.value),{data}=matter(fileData,{...opts,engines:{yaml:__name(s=>yaml.load(s,{schema:yaml.JSON_SCHEMA}),"yaml"),toml:__name(s=>toml.parse(s),"toml")}});data.title!=null&&data.title.toString()!==""?data.title=data.title.toString():data.title=file.stem??i18n(cfg.configuration.locale).propertyDefaults.title;let tags=coerceToArray(coalesceAliases(data,["tags","tag"]));tags&&(data.tags=[...new Set(tags.map(tag=>slugTag(tag)))]);let aliases=coerceToArray(coalesceAliases(data,["aliases","alias"]));if(aliases&&(data.aliases=aliases,file.data.aliases=getAliasSlugs(aliases),allSlugs.push(...file.data.aliases)),data.permalink!=null&&data.permalink.toString()!==""){data.permalink=data.permalink.toString();let aliases2=file.data.aliases??[];aliases2.push(data.permalink),file.data.aliases=aliases2,allSlugs.push(data.permalink)}let cssclasses=coerceToArray(coalesceAliases(data,["cssclasses","cssclass"]));cssclasses&&(data.cssclasses=cssclasses);let socialImage=coalesceAliases(data,["socialImage","image","cover"]),created=coalesceAliases(data,["created","date"]);created&&(data.created=created);let modified=coalesceAliases(data,["modified","lastmod","updated","last-modified"]);modified&&(data.modified=modified),data.modified||=created;let published=coalesceAliases(data,["published","publishDate","date"]);published&&(data.published=published),socialImage&&(data.socialImage=socialImage);let uniqueSlugs=[...new Set(allSlugs)];allSlugs.splice(0,allSlugs.length,...uniqueSlugs),file.data.frontmatter=data}]}}},"FrontMatter");import remarkGfm from"remark-gfm";import smartypants from"remark-smartypants";import rehypeSlug from"rehype-slug";import rehypeAutolinkHeadings from"rehype-autolink-headings";var defaultOptions2={enableSmartyPants:!0,linkHeadings:!0},GitHubFlavoredMarkdown=__name(userOpts=>{let opts={...defaultOptions2,...userOpts};return{name:"GitHubFlavoredMarkdown",markdownPlugins(){return opts.enableSmartyPants?[remarkGfm,smartypants]:[remarkGfm]},htmlPlugins(){return opts.linkHeadings?[rehypeSlug,[rehypeAutolinkHeadings,{behavior:"append",properties:{role:"anchor",ariaHidden:!0,tabIndex:-1,"data-no-popover":!0},content:{type:"element",tagName:"svg",properties:{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},children:[{type:"element",tagName:"path",properties:{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"},children:[]},{type:"element",tagName:"path",properties:{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"},children:[]}]}}]]:[]}}},"GitHubFlavoredMarkdown");import rehypeCitation from"rehype-citation";import{visit}from"unist-util-visit";import fs from"fs";import{Repository}from"@napi-rs/simple-git";import path2 from"path";import{styleText as styleText4}from"util";var defaultOptions3={priority:["frontmatter","git","filesystem"]},iso8601DateOnlyRegex=/^\d{4}-\d{2}-\d{2}$/;function coerceDate(fp,d){typeof d=="string"&&iso8601DateOnlyRegex.test(d)&&(d=`${d}T00:00:00`);let dt=new Date(d),invalidDate=isNaN(dt.getTime())||dt.getTime()===0;return invalidDate&&d!==void 0&&console.log(styleText4("yellow",`
Warning: found invalid date "${d}" in \`${fp}\`. Supported formats: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format`)),invalidDate?new Date:dt}__name(coerceDate,"coerceDate");var CreatedModifiedDate=__name(userOpts=>{let opts={...defaultOptions3,...userOpts};return{name:"CreatedModifiedDate",markdownPlugins(ctx){return[()=>{let repo,repositoryWorkdir;if(opts.priority.includes("git"))try{repo=Repository.discover(ctx.argv.directory),repositoryWorkdir=repo.workdir()??ctx.argv.directory}catch{console.log(styleText4("yellow",`
Warning: couldn't find git repository for ${ctx.argv.directory}`))}return async(_tree,file)=>{let created,modified,published,fp=file.data.relativePath,fullFp=file.data.filePath;for(let source of opts.priority)if(source==="filesystem"){let st=await fs.promises.stat(fullFp);created||=st.birthtimeMs,modified||=st.mtimeMs}else if(source==="frontmatter"&&file.data.frontmatter)created||=file.data.frontmatter.created,modified||=file.data.frontmatter.modified,published||=file.data.frontmatter.published;else if(source==="git"&&repo)try{let relativePath=path2.relative(repositoryWorkdir,fullFp);modified||=await repo.getFileLatestModifiedDateAsync(relativePath)}catch{console.log(styleText4("yellow",`
Warning: ${file.data.filePath} isn't yet tracked by git, dates will be inaccurate`))}file.data.dates={created:coerceDate(fp,created),modified:coerceDate(fp,modified),published:coerceDate(fp,published)}}}]}}},"CreatedModifiedDate");import remarkMath from"remark-math";import rehypeKatex from"rehype-katex";import rehypeMathjax from"rehype-mathjax/svg";import rehypeTypst from"@myriaddreamin/rehype-typst";var Latex=__name(opts=>{let engine=opts?.renderEngine??"katex",macros=opts?.customMacros??{};return{name:"Latex",markdownPlugins(){return[remarkMath]},htmlPlugins(){switch(engine){case"katex":return[[rehypeKatex,{output:"html",macros,...opts?.katexOptions??{}}]];case"typst":return[[rehypeTypst,opts?.typstOptions??{}]];default:case"mathjax":return[[rehypeMathjax,{...opts?.mathJaxOptions??{},tex:{...opts?.mathJaxOptions?.tex??{},macros}}]]}},externalResources(){if(engine==="katex")return{css:[{content:"https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"}],js:[{src:"https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",loadTime:"afterDOMReady",contentType:"external"}]}}}},"Latex");import{toString}from"hast-util-to-string";var escapeHTML=__name(unsafe=>unsafe.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),"escapeHTML"),unescapeHTML=__name(html=>html.replaceAll("&amp;","&").replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&quot;",'"').replaceAll("&#039;","'"),"unescapeHTML");var defaultOptions4={descriptionLength:150,maxDescriptionLength:300,replaceExternalLinks:!0},urlRegex=new RegExp(/(https?:\/\/)?(?<domain>([\da-z\.-]+)\.([a-z\.]{2,6})(:\d+)?)(?<path>[\/\w\.-]*)(\?[\/\w\.=&;-]*)?/,"g"),Description=__name(userOpts=>{let opts={...defaultOptions4,...userOpts};return{name:"Description",htmlPlugins(){return[()=>async(tree,file)=>{let frontMatterDescription=file.data.frontmatter?.description,text=escapeHTML(toString(tree));if(opts.replaceExternalLinks&&(frontMatterDescription=frontMatterDescription?.replace(urlRegex,"$<domain>$<path>"),text=text.replace(urlRegex,"$<domain>$<path>")),frontMatterDescription){file.data.description=frontMatterDescription,file.data.text=text;return}let sentences=text.replace(/\s+/g," ").split(/\.\s/),finalDesc="",sentenceIdx=0;for(;sentenceIdx<sentences.length;){let sentence=sentences[sentenceIdx];if(!sentence)break;let currentSentence=sentence.endsWith(".")?sentence:sentence+".";if(finalDesc.length+currentSentence.length+(finalDesc?1:0)<=opts.descriptionLength||sentenceIdx===0)finalDesc+=(finalDesc?" ":"")+currentSentence,sentenceIdx++;else break}file.data.description=finalDesc.length>opts.maxDescriptionLength?finalDesc.slice(0,opts.maxDescriptionLength)+"...":finalDesc,file.data.text=text}]}}},"Description");import path3 from"path";import{visit as visit2}from"unist-util-visit";import isAbsoluteUrl from"is-absolute-url";var defaultOptions5={markdownLinkResolution:"absolute",prettyLinks:!0,openLinksInNewTab:!1,lazyLoad:!1,externalLinkIcon:!0},CrawlLinks=__name(userOpts=>{let opts={...defaultOptions5,...userOpts};return{name:"LinkProcessing",htmlPlugins(ctx){return[()=>(tree,file)=>{let curSlug=simplifySlug(file.data.slug),outgoing=new Set,transformOptions={strategy:opts.markdownLinkResolution,allSlugs:ctx.allSlugs};visit2(tree,"element",(node,_index,_parent)=>{if(node.tagName==="a"&&node.properties&&typeof node.properties.href=="string"){let dest=node.properties.href,classes=node.properties.className??[],isExternal=isAbsoluteUrl(dest,{httpOnly:!1});classes.push(isExternal?"external":"internal"),isExternal&&opts.externalLinkIcon&&node.children.push({type:"element",tagName:"svg",properties:{"aria-hidden":"true",class:"external-icon",style:"max-width:0.8em;max-height:0.8em",viewBox:"0 0 512 512"},children:[{type:"element",tagName:"path",properties:{d:"M320 0H288V64h32 82.7L201.4 265.4 178.7 288 224 333.3l22.6-22.6L448 109.3V192v32h64V192 32 0H480 320zM32 32H0V64 480v32H32 456h32V480 352 320H424v32 96H64V96h96 32V32H160 32z"},children:[]}]}),node.children.length===1&&node.children[0].type==="text"&&node.children[0].value!==dest&&classes.push("alias"),node.properties.className=classes,isExternal&&opts.openLinksInNewTab&&(node.properties.target="_blank");let isInternal=!(isAbsoluteUrl(dest,{httpOnly:!1})||dest.startsWith("#"));if(isInternal){dest=node.properties.href=transformLink(file.data.slug,dest,transformOptions);let canonicalDest=new URL(dest,"https://base.com/"+stripSlashes(curSlug,!0)).pathname,[destCanonical,_destAnchor]=splitAnchor(canonicalDest);destCanonical.endsWith("/")&&(destCanonical+="index");let full=decodeURIComponent(stripSlashes(destCanonical,!0)),simple=simplifySlug(full);outgoing.add(simple),node.properties["data-slug"]=full}opts.prettyLinks&&isInternal&&node.children.length===1&&node.children[0].type==="text"&&!node.children[0].value.startsWith("#")&&(node.children[0].value=path3.basename(node.children[0].value))}if(["img","video","audio","iframe"].includes(node.tagName)&&node.properties&&typeof node.properties.src=="string"&&(opts.lazyLoad&&(node.properties.loading="lazy"),!isAbsoluteUrl(node.properties.src,{httpOnly:!1}))){let dest=node.properties.src;dest=node.properties.src=transformLink(file.data.slug,dest,transformOptions),node.properties.src=dest}}),file.data.links=[...outgoing]}]}}},"CrawlLinks");import{findAndReplace as mdastFindReplace}from"mdast-util-find-and-replace";import rehypeRaw from"rehype-raw";import{SKIP,visit as visit3}from"unist-util-visit";import path4 from"path";var callout_inline_default=`function n(){let t=this.parentElement;t.classList.toggle("is-collapsed");let e=t.getElementsByClassName("callout-content")[0];if(!e)return;let l=t.classList.contains("is-collapsed");e.style.gridTemplateRows=l?"0fr":"1fr"}function c(){let t=document.getElementsByClassName("callout is-collapsible");for(let e of t){let l=e.getElementsByClassName("callout-title")[0],s=e.getElementsByClassName("callout-content")[0];if(!l||!s)continue;l.addEventListener("click",n),window.addCleanup(()=>l.removeEventListener("click",n));let o=e.classList.contains("is-collapsed");s.style.gridTemplateRows=o?"0fr":"1fr"}}document.addEventListener("nav",c);
`;var checkbox_inline_default='var m=Object.create;var f=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var y=Object.getPrototypeOf,b=Object.prototype.hasOwnProperty;var R=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var j=(t,e,n,E)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of S(e))!b.call(t,i)&&i!==n&&f(t,i,{get:()=>e[i],enumerable:!(E=x(e,i))||E.enumerable});return t};var w=(t,e,n)=>(n=t!=null?m(y(t)):{},j(e||!t||!t.__esModule?f(n,"default",{value:t,enumerable:!0}):n,t));var p=R((I,g)=>{"use strict";g.exports=L;function B(t){return t instanceof Buffer?Buffer.from(t):new t.constructor(t.buffer.slice(),t.byteOffset,t.length)}function L(t){if(t=t||{},t.circles)return v(t);let e=new Map;if(e.set(Date,F=>new Date(F)),e.set(Map,(F,l)=>new Map(E(Array.from(F),l))),e.set(Set,(F,l)=>new Set(E(Array.from(F),l))),t.constructorHandlers)for(let F of t.constructorHandlers)e.set(F[0],F[1]);let n=null;return t.proto?o:i;function E(F,l){let u=Object.keys(F),D=new Array(u.length);for(let s=0;s<u.length;s++){let r=u[s],A=F[r];typeof A!="object"||A===null?D[r]=A:A.constructor!==Object&&(n=e.get(A.constructor))?D[r]=n(A,l):ArrayBuffer.isView(A)?D[r]=B(A):D[r]=l(A)}return D}function i(F){if(typeof F!="object"||F===null)return F;if(Array.isArray(F))return E(F,i);if(F.constructor!==Object&&(n=e.get(F.constructor)))return n(F,i);let l={};for(let u in F){if(Object.hasOwnProperty.call(F,u)===!1)continue;let D=F[u];typeof D!="object"||D===null?l[u]=D:D.constructor!==Object&&(n=e.get(D.constructor))?l[u]=n(D,i):ArrayBuffer.isView(D)?l[u]=B(D):l[u]=i(D)}return l}function o(F){if(typeof F!="object"||F===null)return F;if(Array.isArray(F))return E(F,o);if(F.constructor!==Object&&(n=e.get(F.constructor)))return n(F,o);let l={};for(let u in F){let D=F[u];typeof D!="object"||D===null?l[u]=D:D.constructor!==Object&&(n=e.get(D.constructor))?l[u]=n(D,o):ArrayBuffer.isView(D)?l[u]=B(D):l[u]=o(D)}return l}}function v(t){let e=[],n=[],E=new Map;if(E.set(Date,u=>new Date(u)),E.set(Map,(u,D)=>new Map(o(Array.from(u),D))),E.set(Set,(u,D)=>new Set(o(Array.from(u),D))),t.constructorHandlers)for(let u of t.constructorHandlers)E.set(u[0],u[1]);let i=null;return t.proto?l:F;function o(u,D){let s=Object.keys(u),r=new Array(s.length);for(let A=0;A<s.length;A++){let c=s[A],C=u[c];if(typeof C!="object"||C===null)r[c]=C;else if(C.constructor!==Object&&(i=E.get(C.constructor)))r[c]=i(C,D);else if(ArrayBuffer.isView(C))r[c]=B(C);else{let a=e.indexOf(C);a!==-1?r[c]=n[a]:r[c]=D(C)}}return r}function F(u){if(typeof u!="object"||u===null)return u;if(Array.isArray(u))return o(u,F);if(u.constructor!==Object&&(i=E.get(u.constructor)))return i(u,F);let D={};e.push(u),n.push(D);for(let s in u){if(Object.hasOwnProperty.call(u,s)===!1)continue;let r=u[s];if(typeof r!="object"||r===null)D[s]=r;else if(r.constructor!==Object&&(i=E.get(r.constructor)))D[s]=i(r,F);else if(ArrayBuffer.isView(r))D[s]=B(r);else{let A=e.indexOf(r);A!==-1?D[s]=n[A]:D[s]=F(r)}}return e.pop(),n.pop(),D}function l(u){if(typeof u!="object"||u===null)return u;if(Array.isArray(u))return o(u,l);if(u.constructor!==Object&&(i=E.get(u.constructor)))return i(u,l);let D={};e.push(u),n.push(D);for(let s in u){let r=u[s];if(typeof r!="object"||r===null)D[s]=r;else if(r.constructor!==Object&&(i=E.get(r.constructor)))D[s]=i(r,l);else if(ArrayBuffer.isView(r))D[s]=B(r);else{let A=e.indexOf(r);A!==-1?D[s]=n[A]:D[s]=l(r)}}return e.pop(),n.pop(),D}}});var T=Object.hasOwnProperty;var h=w(p(),1),O=(0,h.default)();function d(t){return t.document.body.dataset.slug}var k=t=>`${d(window)}-checkbox-${t}`;document.addEventListener("nav",()=>{document.querySelectorAll("input.checkbox-toggle").forEach((e,n)=>{let E=k(n),i=o=>{let F=o.target?.checked?"true":"false";localStorage.setItem(E,F)};e.addEventListener("change",i),window.addCleanup(()=>e.removeEventListener("change",i)),localStorage.getItem(E)==="true"&&(e.checked=!0)})});\n';var mermaid_inline_default='function E(a,e){if(!a)return;function t(o){o.target===this&&(o.preventDefault(),o.stopPropagation(),e())}function n(o){o.key.startsWith("Esc")&&(o.preventDefault(),e())}a?.addEventListener("click",t),window.addCleanup(()=>a?.removeEventListener("click",t)),document.addEventListener("keydown",n),window.addCleanup(()=>document.removeEventListener("keydown",n))}function f(a){for(;a.firstChild;)a.removeChild(a.firstChild)}var m=class{constructor(e,t){this.container=e;this.content=t;this.setupEventListeners(),this.setupNavigationControls(),this.resetTransform()}container;content;isDragging=!1;startPan={x:0,y:0};currentPan={x:0,y:0};scale=1;MIN_SCALE=.5;MAX_SCALE=3;cleanups=[];setupEventListeners(){let e=this.onMouseDown.bind(this),t=this.onMouseMove.bind(this),n=this.onMouseUp.bind(this),o=this.onTouchStart.bind(this),r=this.onTouchMove.bind(this),i=this.onTouchEnd.bind(this),s=this.resetTransform.bind(this);this.container.addEventListener("mousedown",e),document.addEventListener("mousemove",t),document.addEventListener("mouseup",n),this.container.addEventListener("touchstart",o,{passive:!1}),document.addEventListener("touchmove",r,{passive:!1}),document.addEventListener("touchend",i),window.addEventListener("resize",s),this.cleanups.push(()=>this.container.removeEventListener("mousedown",e),()=>document.removeEventListener("mousemove",t),()=>document.removeEventListener("mouseup",n),()=>this.container.removeEventListener("touchstart",o),()=>document.removeEventListener("touchmove",r),()=>document.removeEventListener("touchend",i),()=>window.removeEventListener("resize",s))}cleanup(){for(let e of this.cleanups)e()}setupNavigationControls(){let e=document.createElement("div");e.className="mermaid-controls";let t=this.createButton("+",()=>this.zoom(.1)),n=this.createButton("-",()=>this.zoom(-.1)),o=this.createButton("Reset",()=>this.resetTransform());e.appendChild(n),e.appendChild(o),e.appendChild(t),this.container.appendChild(e)}createButton(e,t){let n=document.createElement("button");return n.textContent=e,n.className="mermaid-control-button",n.addEventListener("click",t),window.addCleanup(()=>n.removeEventListener("click",t)),n}onMouseDown(e){e.button===0&&(this.isDragging=!0,this.startPan={x:e.clientX-this.currentPan.x,y:e.clientY-this.currentPan.y},this.container.style.cursor="grabbing")}onMouseMove(e){this.isDragging&&(e.preventDefault(),this.currentPan={x:e.clientX-this.startPan.x,y:e.clientY-this.startPan.y},this.updateTransform())}onMouseUp(){this.isDragging=!1,this.container.style.cursor="grab"}onTouchStart(e){if(e.touches.length!==1)return;this.isDragging=!0;let t=e.touches[0];this.startPan={x:t.clientX-this.currentPan.x,y:t.clientY-this.currentPan.y}}onTouchMove(e){if(!this.isDragging||e.touches.length!==1)return;e.preventDefault();let t=e.touches[0];this.currentPan={x:t.clientX-this.startPan.x,y:t.clientY-this.startPan.y},this.updateTransform()}onTouchEnd(){this.isDragging=!1}zoom(e){let t=Math.min(Math.max(this.scale+e,this.MIN_SCALE),this.MAX_SCALE),n=this.content.getBoundingClientRect(),o=n.width/2,r=n.height/2,i=t-this.scale;this.currentPan.x-=o*i,this.currentPan.y-=r*i,this.scale=t,this.updateTransform()}updateTransform(){this.content.style.transform=`translate(${this.currentPan.x}px, ${this.currentPan.y}px) scale(${this.scale})`}resetTransform(){let t=this.content.querySelector("svg").getBoundingClientRect(),n=t.width/this.scale,o=t.height/this.scale;this.scale=1,this.currentPan={x:(this.container.clientWidth-n)/2,y:(this.container.clientHeight-o)/2},this.updateTransform()}},T=["--secondary","--tertiary","--gray","--light","--lightgray","--highlight","--dark","--darkgray","--codeFont"],y;document.addEventListener("nav",async()=>{let e=document.querySelector(".center").querySelectorAll("code.mermaid");if(e.length===0)return;y||=await import("https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.esm.min.mjs");let t=y.default,n=new WeakMap;for(let r of e)n.set(r,r.innerText);async function o(){for(let s of e){s.removeAttribute("data-processed");let c=n.get(s);c&&(s.innerHTML=c)}let r=T.reduce((s,c)=>(s[c]=window.getComputedStyle(document.documentElement).getPropertyValue(c),s),{}),i=document.documentElement.getAttribute("saved-theme")==="dark";t.initialize({startOnLoad:!1,securityLevel:"loose",theme:i?"dark":"base",themeVariables:{fontFamily:r["--codeFont"],primaryColor:r["--light"],primaryTextColor:r["--darkgray"],primaryBorderColor:r["--tertiary"],lineColor:r["--darkgray"],secondaryColor:r["--secondary"],tertiaryColor:r["--tertiary"],clusterBkg:r["--light"],edgeLabelBackground:r["--highlight"]}}),await t.run({nodes:e})}await o(),document.addEventListener("themechange",o),window.addCleanup(()=>document.removeEventListener("themechange",o));for(let r=0;r<e.length;r++){let v=function(){let g=l.querySelector("#mermaid-space"),h=l.querySelector(".mermaid-content");if(!h)return;f(h);let w=i.querySelector("svg").cloneNode(!0);h.appendChild(w),l.classList.add("active"),g.style.cursor="grab",u=new m(g,h)},M=function(){l.classList.remove("active"),u?.cleanup(),u=null},i=e[r],s=i.parentElement,c=s.querySelector(".clipboard-button"),d=s.querySelector(".expand-button"),p=window.getComputedStyle(c),L=c.offsetWidth+parseFloat(p.marginLeft||"0")+parseFloat(p.marginRight||"0");d.style.right=`calc(${L}px + 0.3rem)`,s.prepend(d);let l=s.querySelector("#mermaid-container");if(!l)return;let u=null;d.addEventListener("click",v),E(l,M),window.addCleanup(()=>{u?.cleanup(),d.removeEventListener("click",v)})}});\n';var mermaid_inline_default2=`.expand-button {
  position: absolute;
  display: flex;
  float: right;
  padding: 0.4rem;
  margin: 0.3rem;
  right: 0;
  color: var(--gray);
  border-color: var(--dark);
  background-color: var(--light);
  border: 1px solid;
  border-radius: 5px;
  opacity: 0;
  transition: 0.2s;
}
.expand-button > svg {
  fill: var(--light);
  filter: contrast(0.3);
}
.expand-button:hover {
  cursor: pointer;
  border-color: var(--secondary);
}
.expand-button:focus {
  outline: 0;
}

pre:hover > .expand-button {
  opacity: 1;
  transition: 0.2s;
}

#mermaid-container {
  position: fixed;
  contain: layout;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: none;
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.5);
}
#mermaid-container.active {
  display: inline-block;
}
#mermaid-container > #mermaid-space {
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80vh;
  width: 80vw;
  overflow: hidden;
}
#mermaid-container > #mermaid-space > .mermaid-content {
  position: relative;
  transform-origin: 0 0;
  transition: transform 0.1s ease;
  overflow: visible;
  min-height: 200px;
  min-width: 200px;
}
#mermaid-container > #mermaid-space > .mermaid-content pre {
  margin: 0;
  border: none;
}
#mermaid-container > #mermaid-space > .mermaid-content svg {
  max-width: none;
  height: auto;
}
#mermaid-container > #mermaid-space > .mermaid-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  padding: 8px;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--lightgray);
  background: var(--light);
  color: var(--dark);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-family: var(--bodyFont);
  transition: all 0.2s ease;
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:hover {
  background: var(--lightgray);
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:active {
  transform: translateY(1px);
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:nth-child(2) {
  width: auto;
  padding: 0 12px;
  font-size: 14px;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lcm1haWQuaW5saW5lLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7OztBQUtGO0VBQ0U7RUFDQTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFOztBQUlGO0VBQ0U7RUFDQTtFQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLmV4cGFuZC1idXR0b24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsb2F0OiByaWdodDtcbiAgcGFkZGluZzogMC40cmVtO1xuICBtYXJnaW46IDAuM3JlbTtcbiAgcmlnaHQ6IDA7IC8vIE5PVEU6IHJpZ2h0IHdpbGwgYmUgc2V0IGluIG1lcm1haWQuaW5saW5lLnRzXG4gIGNvbG9yOiB2YXIoLS1ncmF5KTtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICBib3JkZXI6IDFweCBzb2xpZDtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOiAwLjJzO1xuXG4gICYgPiBzdmcge1xuICAgIGZpbGw6IHZhcigtLWxpZ2h0KTtcbiAgICBmaWx0ZXI6IGNvbnRyYXN0KDAuMyk7XG4gIH1cblxuICAmOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICB9XG5cbiAgJjpmb2N1cyB7XG4gICAgb3V0bGluZTogMDtcbiAgfVxufVxuXG5wcmUge1xuICAmOmhvdmVyID4gLmV4cGFuZC1idXR0b24ge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNpdGlvbjogMC4ycztcbiAgfVxufVxuXG4jbWVybWFpZC1jb250YWluZXIge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGNvbnRhaW46IGxheW91dDtcbiAgei1pbmRleDogOTk5O1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHdpZHRoOiAxMDB2dztcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgZGlzcGxheTogbm9uZTtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDRweCk7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC41KTtcblxuICAmLmFjdGl2ZSB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB9XG5cbiAgJiA+ICNtZXJtYWlkLXNwYWNlIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0KTtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHRvcDogNTAlO1xuICAgIGxlZnQ6IDUwJTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgICBoZWlnaHQ6IDgwdmg7XG4gICAgd2lkdGg6IDgwdnc7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICAgICYgPiAubWVybWFpZC1jb250ZW50IHtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjFzIGVhc2U7XG4gICAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICAgIG1pbi1oZWlnaHQ6IDIwMHB4O1xuICAgICAgbWluLXdpZHRoOiAyMDBweDtcblxuICAgICAgcHJlIHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICB9XG5cbiAgICAgIHN2ZyB7XG4gICAgICAgIG1heC13aWR0aDogbm9uZTtcbiAgICAgICAgaGVpZ2h0OiBhdXRvO1xuICAgICAgfVxuICAgIH1cblxuICAgICYgPiAubWVybWFpZC1jb250cm9scyB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBib3R0b206IDIwcHg7XG4gICAgICByaWdodDogMjBweDtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBnYXA6IDhweDtcbiAgICAgIHBhZGRpbmc6IDhweDtcbiAgICAgIGJhY2tncm91bmQ6IHZhcigtLWxpZ2h0KTtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICBib3gtc2hhZG93OiAwIDJweCA0cHggcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAgICAgei1pbmRleDogMjtcblxuICAgICAgLm1lcm1haWQtY29udHJvbC1idXR0b24ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IDMycHg7XG4gICAgICAgIGhlaWdodDogMzJweDtcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tbGlnaHQpO1xuICAgICAgICBjb2xvcjogdmFyKC0tZGFyayk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1ib2R5Rm9udCk7XG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMXB4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN0eWxlIHRoZSByZXNldCBidXR0b24gZGlmZmVyZW50bHlcbiAgICAgICAgJjpudGgtY2hpbGQoMikge1xuICAgICAgICAgIHdpZHRoOiBhdXRvO1xuICAgICAgICAgIHBhZGRpbmc6IDAgMTJweDtcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;import{toHast}from"mdast-util-to-hast";import{toHtml}from"hast-util-to-html";function capitalize(s){return s.substring(0,1).toUpperCase()+s.substring(1)}__name(capitalize,"capitalize");function classNames(displayClass,...classes){return displayClass&&classes.push(displayClass),classes.join(" ")}__name(classNames,"classNames");var defaultOptions6={comments:!0,highlight:!0,wikilinks:!0,callouts:!0,mermaid:!0,parseTags:!0,parseArrows:!0,parseBlockReferences:!0,enableInHtmlEmbed:!1,enableYouTubeEmbed:!0,enableVideoEmbed:!0,enableCheckbox:!1,disableBrokenWikilinks:!1},calloutMapping={note:"note",abstract:"abstract",summary:"abstract",tldr:"abstract",info:"info",todo:"todo",tip:"tip",hint:"tip",important:"tip",success:"success",check:"success",done:"success",question:"question",help:"question",faq:"question",warning:"warning",attention:"warning",caution:"warning",failure:"failure",missing:"failure",fail:"failure",danger:"danger",error:"danger",bug:"bug",example:"example",quote:"quote",cite:"quote"},arrowMapping={"->":"&rarr;","-->":"&rArr;","=>":"&rArr;","==>":"&rArr;","<-":"&larr;","<--":"&lArr;","<=":"&lArr;","<==":"&lArr;"};function canonicalizeCallout(calloutName){let normalizedCallout=calloutName.toLowerCase();return calloutMapping[normalizedCallout]??calloutName}__name(canonicalizeCallout,"canonicalizeCallout");var externalLinkRegex=/^https?:\/\//i,arrowRegex=new RegExp(/(-{1,2}>|={1,2}>|<-{1,2}|<={1,2})/g),wikilinkRegex=new RegExp(/!?\[\[([^\[\]\|\#\\]+)?(#+[^\[\]\|\#\\]+)?(\\?\|[^\[\]\#]*)?\]\]/g),tableRegex=new RegExp(/^\|([^\n])+\|\n(\|)( ?:?-{3,}:? ?\|)+\n(\|([^\n])+\|\n?)+/gm),tableWikilinkRegex=new RegExp(/(!?\[\[[^\]]*?\]\]|\[\^[^\]]*?\])/g),highlightRegex=new RegExp(/==([^=]+)==/g),commentRegex=new RegExp(/%%[\s\S]*?%%/g),calloutRegex=new RegExp(/^\[\!([\w-]+)\|?(.+?)?\]([+-]?)/),calloutLineRegex=new RegExp(/^> *\[\!\w+\|?.*?\][+-]?.*$/gm),tagRegex=new RegExp(/(?<=^| )#((?:[-_\p{L}\p{Emoji}\p{M}\d])+(?:\/[-_\p{L}\p{Emoji}\p{M}\d]+)*)/gu),blockReferenceRegex=new RegExp(/\^([-_A-Za-z0-9]+)$/g),ytLinkRegex=/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,ytPlaylistLinkRegex=/[?&]list=([^#?&]*)/,videoExtensionRegex=new RegExp(/\.(mp4|webm|ogg|avi|mov|flv|wmv|mkv|mpg|mpeg|3gp|m4v)$/),wikilinkImageEmbedRegex=new RegExp(/^(?<alt>(?!^\d*x?\d*$).*?)?(\|?\s*?(?<width>\d+)(x(?<height>\d+))?)?$/),ObsidianFlavoredMarkdown=__name(userOpts=>{let opts={...defaultOptions6,...userOpts},mdastToHtml=__name(ast=>{let hast=toHast(ast,{allowDangerousHtml:!0});return toHtml(hast,{allowDangerousHtml:!0})},"mdastToHtml");return{name:"ObsidianFlavoredMarkdown",textTransform(_ctx,src){return opts.comments&&(src=src.replace(commentRegex,"")),opts.callouts&&(src=src.replace(calloutLineRegex,value=>value+`
> `)),opts.wikilinks&&(src=src.replace(tableRegex,value=>value.replace(tableWikilinkRegex,(_value,raw)=>{let escaped=raw??"";return escaped=escaped.replace("#","\\#"),escaped=escaped.replace(/((^|[^\\])(\\\\)*)\|/g,"$1\\|"),escaped})),src=src.replace(wikilinkRegex,(value,...capture)=>{let[rawFp,rawHeader,rawAlias]=capture,[fp,anchor]=splitAnchor(`${rawFp??""}${rawHeader??""}`),blockRef=rawHeader?.startsWith("#^")?"^":"",displayAnchor=anchor?`#${blockRef}${anchor.trim().replace(/^#+/,"")}`:"",displayAlias=rawAlias??rawHeader?.replace("#","|")??"",embedDisplay=value.startsWith("!")?"!":"";return rawFp?.match(externalLinkRegex)?`${embedDisplay}[${displayAlias.replace(/^\|/,"")}](${rawFp})`:`${embedDisplay}[[${fp}${displayAnchor}${displayAlias}]]`})),src},markdownPlugins(ctx){let plugins=[];return plugins.push(()=>(tree,file)=>{let replacements=[],base=pathToRoot(file.data.slug);opts.wikilinks&&replacements.push([wikilinkRegex,(value,...capture)=>{let[rawFp,rawHeader,rawAlias]=capture,fp=rawFp?.trim()??"",anchor=rawHeader?.trim()??"",alias=rawAlias?.slice(1).trim();if(value.startsWith("!")){let ext=path4.extname(fp).toLowerCase(),url2=slugifyFilePath(fp);if([".png",".jpg",".jpeg",".gif",".bmp",".svg",".webp"].includes(ext)){let match=wikilinkImageEmbedRegex.exec(alias??""),alt=match?.groups?.alt??"",width=match?.groups?.width??"auto",height=match?.groups?.height??"auto";return{type:"image",url:url2,data:{hProperties:{width,height,alt}}}}else{if([".mp4",".webm",".ogv",".mov",".mkv"].includes(ext))return{type:"html",value:`<video src="${url2}" controls></video>`};if([".mp3",".webm",".wav",".m4a",".ogg",".3gp",".flac"].includes(ext))return{type:"html",value:`<audio src="${url2}" controls></audio>`};if([".pdf"].includes(ext))return{type:"html",value:`<iframe src="${url2}" class="pdf"></iframe>`};{let block=anchor;return{type:"html",data:{hProperties:{transclude:!0}},value:`<blockquote class="transclude" data-url="${url2}" data-block="${block}" data-embed-alias="${alias}"><a href="${url2+anchor}" class="transclude-inner">Transclude of ${url2}${block}</a></blockquote>`}}}}if(opts.disableBrokenWikilinks){let slug=slugifyFilePath(fp);if(!(ctx.allSlugs&&ctx.allSlugs.includes(slug)))return{type:"html",value:`<a class="internal broken">${alias??fp}</a>`}}return{type:"link",url:fp+anchor,children:[{type:"text",value:alias??fp}]}}]),opts.highlight&&replacements.push([highlightRegex,(_value,...capture)=>{let[inner]=capture;return{type:"html",value:`<span class="text-highlight">${inner}</span>`}}]),opts.parseArrows&&replacements.push([arrowRegex,(value,..._capture)=>{let maybeArrow=arrowMapping[value];return maybeArrow===void 0?SKIP:{type:"html",value:`<span>${maybeArrow}</span>`}}]),opts.parseTags&&replacements.push([tagRegex,(_value,tag)=>{if(/^[\/\d]+$/.test(tag))return!1;if(tag=slugTag(tag),file.data.frontmatter){let noteTags=file.data.frontmatter.tags??[];file.data.frontmatter.tags=[...new Set([...noteTags,tag])]}return{type:"link",url:base+`/tags/${tag}`,data:{hProperties:{className:["tag-link"]}},children:[{type:"text",value:tag}]}}]),opts.enableInHtmlEmbed&&visit3(tree,"html",node=>{for(let[regex,replace]of replacements)typeof replace=="string"?node.value=node.value.replace(regex,replace):node.value=node.value.replace(regex,(substring,...args)=>{let replaceValue=replace(substring,...args);return typeof replaceValue=="string"?replaceValue:Array.isArray(replaceValue)?replaceValue.map(mdastToHtml).join(""):typeof replaceValue=="object"&&replaceValue!==null?mdastToHtml(replaceValue):substring})}),mdastFindReplace(tree,replacements)}),opts.enableVideoEmbed&&plugins.push(()=>(tree,_file)=>{visit3(tree,"image",(node,index,parent)=>{if(parent&&index!=null&&videoExtensionRegex.test(node.url)){let newNode={type:"html",value:`<video controls src="${node.url}"></video>`};return parent.children.splice(index,1,newNode),SKIP}})}),opts.callouts&&plugins.push(()=>(tree,_file)=>{visit3(tree,"blockquote",node=>{if(node.children.length===0)return;let[firstChild,...calloutContent]=node.children;if(firstChild.type!=="paragraph"||firstChild.children[0]?.type!=="text")return;let text=firstChild.children[0].value,restOfTitle=firstChild.children.slice(1),[firstLine,...remainingLines]=text.split(`
`),remainingText=remainingLines.join(`
`),match=firstLine.match(calloutRegex);if(match&&match.input){let[calloutDirective,typeString,calloutMetaData,collapseChar]=match,calloutType=canonicalizeCallout(typeString.toLowerCase()),collapse=collapseChar==="+"||collapseChar==="-",defaultState=collapseChar==="-"?"collapsed":"expanded",titleContent=match.input.slice(calloutDirective.length).trim(),titleNode={type:"paragraph",children:[{type:"text",value:titleContent===""&&restOfTitle.length===0?capitalize(typeString).replace(/-/g," "):titleContent+" "},...restOfTitle]},blockquoteContent=[{type:"html",value:`<div
                  class="callout-title"
                >
                  <div class="callout-icon"></div>
                  <div class="callout-title-inner">${mdastToHtml(titleNode)}</div>
                  ${collapse?'<div class="fold-callout-icon"></div>':""}
                </div>`}];remainingText.length>0&&blockquoteContent.push({type:"paragraph",children:[{type:"text",value:remainingText}]}),calloutContent.length>0&&(node.children=[node.children[0],{data:{hProperties:{className:["callout-content"]},hName:"div"},type:"blockquote",children:[...calloutContent]}]),node.children.splice(0,1,...blockquoteContent);let classNames2=["callout",calloutType];collapse&&classNames2.push("is-collapsible"),defaultState==="collapsed"&&classNames2.push("is-collapsed"),node.data={hProperties:{...node.data?.hProperties??{},className:classNames2.join(" "),"data-callout":calloutType,"data-callout-fold":collapse,"data-callout-metadata":calloutMetaData}}}})}),opts.mermaid&&plugins.push(()=>(tree,file)=>{visit3(tree,"code",node=>{node.lang==="mermaid"&&(file.data.hasMermaidDiagram=!0,node.data={hProperties:{className:["mermaid"],"data-clipboard":JSON.stringify(node.value)}})})}),plugins},htmlPlugins(){let plugins=[rehypeRaw];return opts.parseBlockReferences&&plugins.push(()=>{let inlineTagTypes=new Set(["p","li"]),blockTagTypes=new Set(["blockquote"]);return(tree,file)=>{file.data.blocks={},visit3(tree,"element",(node,index,parent)=>{if(blockTagTypes.has(node.tagName)){let nextChild=parent?.children.at(index+2);if(nextChild&&nextChild.tagName==="p"){let text=nextChild.children.at(0);if(text&&text.value&&text.type==="text"){let matches=text.value.match(blockReferenceRegex);if(matches&&matches.length>=1){parent.children.splice(index+2,1);let block=matches[0].slice(1);Object.keys(file.data.blocks).includes(block)||(node.properties={...node.properties,id:block},file.data.blocks[block]=node)}}}}else if(inlineTagTypes.has(node.tagName)){let last=node.children.at(-1);if(last&&last.value&&typeof last.value=="string"){let matches=last.value.match(blockReferenceRegex);if(matches&&matches.length>=1){last.value=last.value.slice(0,-matches[0].length);let block=matches[0].slice(1);if(last.value===""){let idx=(index??1)-1;for(;idx>=0;){let element=parent?.children.at(idx);if(!element)break;if(element.type!=="element")idx-=1;else{Object.keys(file.data.blocks).includes(block)||(element.properties={...element.properties,id:block},file.data.blocks[block]=element);return}}}else Object.keys(file.data.blocks).includes(block)||(node.properties={...node.properties,id:block},file.data.blocks[block]=node)}}}}),file.data.htmlAst=tree}}),opts.enableYouTubeEmbed&&plugins.push(()=>tree=>{visit3(tree,"element",node=>{if(node.tagName==="img"&&typeof node.properties.src=="string"){let match=node.properties.src.match(ytLinkRegex),videoId=match&&match[2].length==11?match[2]:null,playlistId=node.properties.src.match(ytPlaylistLinkRegex)?.[1];videoId?(node.tagName="iframe",node.properties={class:"external-embed youtube",allow:"fullscreen",frameborder:0,width:"600px",src:playlistId?`https://www.youtube.com/embed/${videoId}?list=${playlistId}`:`https://www.youtube.com/embed/${videoId}`}):playlistId&&(node.tagName="iframe",node.properties={class:"external-embed youtube",allow:"fullscreen",frameborder:0,width:"600px",src:`https://www.youtube.com/embed/videoseries?list=${playlistId}`})}})}),opts.enableCheckbox&&plugins.push(()=>(tree,_file)=>{visit3(tree,"element",node=>{if(node.tagName==="input"&&node.properties.type==="checkbox"){let isChecked=node.properties?.checked??!1;node.properties={type:"checkbox",disabled:!1,checked:isChecked,class:"checkbox-toggle"}}})}),opts.mermaid&&plugins.push(()=>(tree,_file)=>{visit3(tree,"element",(node,_idx,parent)=>{node.tagName==="code"&&(node.properties?.className??[])?.includes("mermaid")&&(parent.children=[{type:"element",tagName:"button",properties:{className:["expand-button"],"aria-label":"Expand mermaid diagram","data-view-component":!0},children:[{type:"element",tagName:"svg",properties:{width:16,height:16,viewBox:"0 0 16 16",fill:"currentColor"},children:[{type:"element",tagName:"path",properties:{fillRule:"evenodd",d:"M3.72 3.72a.75.75 0 011.06 1.06L2.56 7h10.88l-2.22-2.22a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.56l2.22 2.22a.75.75 0 11-1.06 1.06l-3.5-3.5a.75.75 0 010-1.06l3.5-3.5z"},children:[]}]}]},node,{type:"element",tagName:"div",properties:{id:"mermaid-container",role:"dialog"},children:[{type:"element",tagName:"div",properties:{id:"mermaid-space"},children:[{type:"element",tagName:"div",properties:{className:["mermaid-content"]},children:[]}]}]}])})}),plugins},externalResources(){let js=[],css=[];return opts.enableCheckbox&&js.push({script:checkbox_inline_default,loadTime:"afterDOMReady",contentType:"inline"}),opts.callouts&&js.push({script:callout_inline_default,loadTime:"afterDOMReady",contentType:"inline"}),opts.mermaid&&(js.push({script:mermaid_inline_default,loadTime:"afterDOMReady",contentType:"inline",moduleType:"module"}),css.push({content:mermaid_inline_default2,inline:!0})),{js,css}}}},"ObsidianFlavoredMarkdown");import rehypeRaw2 from"rehype-raw";var relrefRegex=new RegExp(/\[([^\]]+)\]\(\{\{< relref "([^"]+)" >\}\}\)/,"g"),predefinedHeadingIdRegex=new RegExp(/(.*) {#(?:.*)}/,"g"),hugoShortcodeRegex=new RegExp(/{{(.*)}}/,"g"),figureTagRegex=new RegExp(/< ?figure src="(.*)" ?>/,"g"),inlineLatexRegex=new RegExp(/\\\\\((.+?)\\\\\)/,"g"),blockLatexRegex=new RegExp(/(?:\\begin{equation}|\\\\\(|\\\\\[)([\s\S]*?)(?:\\\\\]|\\\\\)|\\end{equation})/,"g"),quartzLatexRegex=new RegExp(/\$\$[\s\S]*?\$\$|\$.*?\$/,"g");import rehypePrettyCode from"rehype-pretty-code";var defaultOptions7={theme:{light:"github-light",dark:"github-dark"},keepBackground:!1},SyntaxHighlighting=__name(userOpts=>{let opts={...defaultOptions7,...userOpts};return{name:"SyntaxHighlighting",htmlPlugins(){return[[rehypePrettyCode,opts]]}}},"SyntaxHighlighting");import{visit as visit4}from"unist-util-visit";import{toString as toString2}from"mdast-util-to-string";import Slugger from"github-slugger";var defaultOptions8={maxDepth:3,minEntries:1,showByDefault:!0,collapseByDefault:!1},slugAnchor2=new Slugger,TableOfContents=__name(userOpts=>{let opts={...defaultOptions8,...userOpts};return{name:"TableOfContents",markdownPlugins(){return[()=>async(tree,file)=>{if(file.data.frontmatter?.enableToc??opts.showByDefault){slugAnchor2.reset();let toc=[],highestDepth=opts.maxDepth;visit4(tree,"heading",node=>{if(node.depth<=opts.maxDepth){let text=toString2(node);highestDepth=Math.min(highestDepth,node.depth),toc.push({depth:node.depth,text,slug:slugAnchor2.slug(text)})}}),toc.length>0&&toc.length>opts.minEntries&&(file.data.toc=toc.map(entry=>({...entry,depth:entry.depth-highestDepth})),file.data.collapseToc=opts.collapseByDefault)}}]}}},"TableOfContents");import remarkBreaks from"remark-breaks";import{visit as visit5}from"unist-util-visit";import{findAndReplace as mdastFindReplace2}from"mdast-util-find-and-replace";var orRegex=new RegExp(/{{or:(.*?)}}/,"g"),TODORegex=new RegExp(/{{.*?\bTODO\b.*?}}/,"g"),DONERegex=new RegExp(/{{.*?\bDONE\b.*?}}/,"g"),blockquoteRegex=new RegExp(/(\[\[>\]\])\s*(.*)/,"g"),roamHighlightRegex=new RegExp(/\^\^(.+)\^\^/,"g"),roamItalicRegex=new RegExp(/__(.+)__/,"g");var RemoveDrafts=__name(()=>({name:"RemoveDrafts",shouldPublish(_ctx,[_tree,vfile]){return!(vfile.data?.frontmatter?.draft===!0||vfile.data?.frontmatter?.draft==="true")}}),"RemoveDrafts");import path6 from"path";import{jsx}from"preact/jsx-runtime";var Header=__name(({children})=>children.length>0?jsx("header",{children}):null,"Header");Header.css=`
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
  gap: 1.5rem;
}

header h1 {
  margin: 0;
  flex: auto;
}
`;var Header_default=__name((()=>Header),"default");var clipboard_inline_default=`var r='<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>',l='<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>';document.addEventListener("nav",()=>{let a=document.getElementsByTagName("pre");for(let t=0;t<a.length;t++){let n=a[t].getElementsByTagName("code")[0];if(n){let o=function(){navigator.clipboard.writeText(i).then(()=>{e.blur(),e.innerHTML=l,setTimeout(()=>{e.innerHTML=r,e.style.borderColor=""},2e3)},d=>console.error(d))};var c=o;let i=(n.dataset.clipboard?JSON.parse(n.dataset.clipboard):n.innerText).replace(/\\n\\n/g,\`
\`),e=document.createElement("button");e.className="clipboard-button",e.type="button",e.innerHTML=r,e.ariaLabel="Copy source",e.addEventListener("click",o),window.addCleanup(()=>e.removeEventListener("click",o)),a[t].prepend(e)}}});
`;var clipboard_default=`.clipboard-button {
  position: absolute;
  display: flex;
  float: right;
  right: 0;
  padding: 0.4rem;
  margin: 0.3rem;
  color: var(--gray);
  border-color: var(--dark);
  background-color: var(--light);
  border: 1px solid;
  border-radius: 5px;
  opacity: 0;
  transition: 0.2s;
}
.clipboard-button > svg {
  fill: var(--light);
  filter: contrast(0.3);
}
.clipboard-button:hover {
  cursor: pointer;
  border-color: var(--secondary);
}
.clipboard-button:focus {
  outline: 0;
}

pre:hover > .clipboard-button {
  opacity: 1;
  transition: 0.2s;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaXBib2FyZC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUNFOzs7QUFLRjtFQUNFO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIuY2xpcGJvYXJkLWJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxvYXQ6IHJpZ2h0O1xuICByaWdodDogMDtcbiAgcGFkZGluZzogMC40cmVtO1xuICBtYXJnaW46IDAuM3JlbTtcbiAgY29sb3I6IHZhcigtLWdyYXkpO1xuICBib3JkZXItY29sb3I6IHZhcigtLWRhcmspO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gIGJvcmRlcjogMXB4IHNvbGlkO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIG9wYWNpdHk6IDA7XG4gIHRyYW5zaXRpb246IDAuMnM7XG5cbiAgJiA+IHN2ZyB7XG4gICAgZmlsbDogdmFyKC0tbGlnaHQpO1xuICAgIGZpbHRlcjogY29udHJhc3QoMC4zKTtcbiAgfVxuXG4gICY6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG4gIH1cblxuICAmOmZvY3VzIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG59XG5cbnByZSB7XG4gICY6aG92ZXIgPiAuY2xpcGJvYXJkLWJ1dHRvbiB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2l0aW9uOiAwLjJzO1xuICB9XG59XG4iXX0= */`;import{jsx as jsx2}from"preact/jsx-runtime";var Body=__name(({children})=>jsx2("div",{id:"quartz-body",children}),"Body");Body.afterDOMLoaded=clipboard_inline_default;Body.css=clipboard_default;var Body_default=__name((()=>Body),"default");import{render}from"preact-render-to-string";import{randomUUID}from"crypto";import{jsx as jsx3}from"preact/jsx-runtime";function JSResourceToScriptElement(resource,preserve){let scriptType=resource.moduleType??"application/javascript",spaPreserve=preserve??resource.spaPreserve;if(resource.contentType==="external")return jsx3("script",{src:resource.src,type:scriptType,"data-persist":spaPreserve},resource.src);{let content=resource.script;return jsx3("script",{type:scriptType,"data-persist":spaPreserve,dangerouslySetInnerHTML:{__html:content}},randomUUID())}}__name(JSResourceToScriptElement,"JSResourceToScriptElement");function CSSResourceToStyleElement(resource,preserve){let spaPreserve=preserve??resource.spaPreserve;return resource.inline??!1?jsx3("style",{children:resource.content}):jsx3("link",{href:resource.content,rel:"stylesheet",type:"text/css","data-persist":spaPreserve},resource.content)}__name(CSSResourceToStyleElement,"CSSResourceToStyleElement");function concatenateResources(...resources){return resources.filter(resource=>resource!==void 0).flat()}__name(concatenateResources,"concatenateResources");import{visit as visit6}from"unist-util-visit";import{styleText as styleText5}from"util";import{jsx as jsx4,jsxs}from"preact/jsx-runtime";var headerRegex=new RegExp(/h[1-6]/);function pageResources(baseDir,staticResources){let contentIndexScript=`const fetchData = fetch("${joinSegments(baseDir,"static/contentIndex.json")}").then(data => data.json())`,resources={css:[{content:joinSegments(baseDir,"index.css")},...staticResources.css],js:[{src:joinSegments(baseDir,"prescript.js"),loadTime:"beforeDOMReady",contentType:"external"},{loadTime:"beforeDOMReady",contentType:"inline",spaPreserve:!0,script:contentIndexScript},...staticResources.js],additionalHead:staticResources.additionalHead};return resources.js.push({src:joinSegments(baseDir,"postscript.js"),loadTime:"afterDOMReady",moduleType:"module",contentType:"external"}),resources}__name(pageResources,"pageResources");function renderTranscludes(root,cfg,slug,componentData,visited){visit6(root,"element",(node,_index,_parent)=>{if(node.tagName==="blockquote"&&(node.properties?.className??[]).includes("transclude")){let inner=node.children[0],transcludeTarget=inner.properties["data-slug"]??slug;if(visited.has(transcludeTarget)){console.warn(styleText5("yellow",`Warning: Skipping circular transclusion: ${slug} -> ${transcludeTarget}`)),node.children=[{type:"element",tagName:"p",properties:{style:"color: var(--secondary);"},children:[{type:"text",value:`Circular transclusion detected: ${transcludeTarget}`}]}];return}visited.add(transcludeTarget);let page=componentData.allFiles.find(f=>f.slug===transcludeTarget);if(!page)return;let blockRef=node.properties.dataBlock;if(blockRef?.startsWith("#^")){blockRef=blockRef.slice(2);let blockNode=page.blocks?.[blockRef];blockNode&&(blockNode.tagName==="li"&&(blockNode={type:"element",tagName:"ul",properties:{},children:[blockNode]}),node.children=[normalizeHastElement(blockNode,slug,transcludeTarget),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal","transclude-src"]},children:[{type:"text",value:i18n(cfg.locale).components.transcludes.linkToOriginal}]}])}else if(blockRef?.startsWith("#")&&page.htmlAst){blockRef=blockRef.slice(1);let startIdx,startDepth,endIdx;for(let[i,el]of page.htmlAst.children.entries()){if(!(el.type==="element"&&el.tagName.match(headerRegex)))continue;let depth=Number(el.tagName.substring(1));if(startIdx===void 0||startDepth===void 0)el.properties?.id===blockRef&&(startIdx=i,startDepth=depth);else if(depth<=startDepth){endIdx=i;break}}if(startIdx===void 0)return;node.children=[...page.htmlAst.children.slice(startIdx,endIdx).map(child=>normalizeHastElement(child,slug,transcludeTarget)),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal","transclude-src"]},children:[{type:"text",value:i18n(cfg.locale).components.transcludes.linkToOriginal}]}]}else page.htmlAst&&(node.children=[{type:"element",tagName:"h1",properties:{},children:[{type:"text",value:page.frontmatter?.title??i18n(cfg.locale).components.transcludes.transcludeOf({targetSlug:page.slug})}]},...page.htmlAst.children.map(child=>normalizeHastElement(child,slug,transcludeTarget)),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal","transclude-src"]},children:[{type:"text",value:i18n(cfg.locale).components.transcludes.linkToOriginal}]}])}})}__name(renderTranscludes,"renderTranscludes");function renderPage(cfg,slug,componentData,components,pageResources2){let root=clone(componentData.tree);renderTranscludes(root,cfg,slug,componentData,new Set([slug])),componentData.tree=root;let{head:Head,header,beforeBody,pageBody:Content2,afterBody,left,right,footer:Footer}=components,Header2=Header_default(),Body2=Body_default(),LeftComponent=jsx4("div",{class:"left sidebar",children:left.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))}),RightComponent=jsx4("div",{class:"right sidebar",children:right.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))}),lang=componentData.fileData.frontmatter?.lang??cfg.locale?.split("-")[0]??"en",direction=i18n(cfg.locale).direction??"ltr",doc=jsxs("html",{lang,dir:direction,children:[jsx4(Head,{...componentData}),jsx4("body",{"data-slug":slug,children:jsx4("div",{id:"quartz-root",class:"page",children:jsxs(Body2,{...componentData,children:[LeftComponent,jsxs("div",{class:"center",children:[jsxs("div",{class:"page-header",children:[jsx4(Header2,{...componentData,children:header.map(HeaderComponent=>jsx4(HeaderComponent,{...componentData}))}),jsx4("div",{class:"popover-hint",children:beforeBody.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))})]}),jsx4(Content2,{...componentData}),jsx4("hr",{}),jsx4("div",{class:"page-footer",children:afterBody.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))})]}),RightComponent,jsx4(Footer,{...componentData})]})})}),pageResources2.js.filter(resource=>resource.loadTime==="afterDOMReady").map(res=>JSResourceToScriptElement(res,!0))]});return`<!DOCTYPE html>
`+render(doc)}__name(renderPage,"renderPage");import{toJsxRuntime}from"hast-util-to-jsx-runtime";import{Fragment,jsx as jsx5,jsxs as jsxs2}from"preact/jsx-runtime";import{jsx as jsx6}from"preact/jsx-runtime";var customComponents={table:__name(props=>jsx6("div",{class:"table-container",children:jsx6("table",{...props})}),"table")};function htmlToJsx(fp,tree){try{return toJsxRuntime(tree,{Fragment,jsx:jsx5,jsxs:jsxs2,elementAttributeNameCase:"html",components:customComponents})}catch(e){trace(`Failed to parse Markdown in \`${fp}\` into JSX`,e)}}__name(htmlToJsx,"htmlToJsx");import{jsx as jsx7}from"preact/jsx-runtime";var Content=__name(({fileData,tree})=>{let content=htmlToJsx(fileData.filePath,tree),classString=["popover-hint",...fileData.frontmatter?.cssclasses??[]].join(" ");return jsx7("article",{class:classString,children:content})},"Content"),Content_default=__name((()=>Content),"default");var listPage_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
ul.section-ul {
  list-style: none;
  margin-top: 2em;
  padding-left: 0;
}

li.section-li {
  margin-bottom: 1em;
}
li.section-li > .section {
  display: grid;
  grid-template-columns: fit-content(8em) 3fr 1fr;
}
@media all and ((max-width: 800px)) {
  li.section-li > .section > .tags {
    display: none;
  }
}
li.section-li > .section > .desc > h3 > a {
  background-color: transparent;
}
li.section-li > .section .meta {
  margin: 0 1em 0 0;
  opacity: 0.6;
}

.popover .section {
  grid-template-columns: fit-content(8em) 1fr !important;
}
.popover .section > .tags {
  display: none;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2NzcyIsImxpc3RQYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUNBQTtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTs7QUFFQTtFQUNFO0VBQ0E7O0FBRUE7RUFDRTtJQUNFOzs7QUFJSjtFQUNFOztBQUdGO0VBQ0U7RUFDQTs7O0FBTU47RUFDRTs7QUFFQTtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcInNhc3M6bWFwXCI7XG5cbi8qKlxuICogTGF5b3V0IGJyZWFrcG9pbnRzXG4gKiAkbW9iaWxlOiBzY3JlZW4gd2lkdGggYmVsb3cgdGhpcyB2YWx1ZSB3aWxsIHVzZSBtb2JpbGUgc3R5bGVzXG4gKiAkZGVza3RvcDogc2NyZWVuIHdpZHRoIGFib3ZlIHRoaXMgdmFsdWUgd2lsbCB1c2UgZGVza3RvcCBzdHlsZXNcbiAqIFNjcmVlbiB3aWR0aCBiZXR3ZWVuICRtb2JpbGUgYW5kICRkZXNrdG9wIHdpZHRoIHdpbGwgdXNlIHRoZSB0YWJsZXQgbGF5b3V0LlxuICogYXNzdW1pbmcgbW9iaWxlIDwgZGVza3RvcFxuICovXG4kYnJlYWtwb2ludHM6IChcbiAgbW9iaWxlOiA4MDBweCxcbiAgZGVza3RvcDogMTIwMHB4LFxuKTtcblxuJG1vYmlsZTogXCIobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSlcIjtcbiR0YWJsZXQ6IFwiKG1pbi13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX0pIGFuZCAobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG4kZGVza3RvcDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG5cbiRwYWdlV2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9O1xuJHNpZGVQYW5lbFdpZHRoOiAzMjBweDsgLy8zODBweDtcbiR0b3BTcGFjaW5nOiA2cmVtO1xuJGJvbGRXZWlnaHQ6IDcwMDtcbiRzZW1pQm9sZFdlaWdodDogNjAwO1xuJG5vcm1hbFdlaWdodDogNDAwO1xuXG4kbW9iaWxlR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCJhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0XCJcXFxuICAgICAgXCJncmlkLWhlYWRlclwiXFxcbiAgICAgIFwiZ3JpZC1jZW50ZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1mb290ZXJcIicsXG4pO1xuJHRhYmxldEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWZvb3RlclwiJyxcbik7XG4kZGVza3RvcEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCIjeyRzaWRlUGFuZWxXaWR0aH0gYXV0byAjeyRzaWRlUGFuZWxXaWR0aH1cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyIGdyaWQtc2lkZWJhci1yaWdodFwiJyxcbik7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcblxudWwuc2VjdGlvbi11bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG4gIG1hcmdpbi10b3A6IDJlbTtcbiAgcGFkZGluZy1sZWZ0OiAwO1xufVxuXG5saS5zZWN0aW9uLWxpIHtcbiAgbWFyZ2luLWJvdHRvbTogMWVtO1xuXG4gICYgPiAuc2VjdGlvbiB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGZpdC1jb250ZW50KDhlbSkgM2ZyIDFmcjtcblxuICAgIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgICAmID4gLnRhZ3Mge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgIH1cblxuICAgICYgPiAuZGVzYyA+IGgzID4gYSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICB9XG5cbiAgICAmIC5tZXRhIHtcbiAgICAgIG1hcmdpbjogMCAxZW0gMCAwO1xuICAgICAgb3BhY2l0eTogMC42O1xuICAgIH1cbiAgfVxufVxuXG4vLyBtb2RpZmljYXRpb25zIGluIHBvcG92ZXIgY29udGV4dFxuLnBvcG92ZXIgLnNlY3Rpb24ge1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGZpdC1jb250ZW50KDhlbSkgMWZyICFpbXBvcnRhbnQ7XG5cbiAgJiA+IC50YWdzIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4iXX0= */`;import{jsx as jsx8}from"preact/jsx-runtime";function getDate(cfg,data){if(!cfg.defaultDateType)throw new Error("Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.");return data.dates?.[cfg.defaultDateType]}__name(getDate,"getDate");function formatDate(d,locale="en-US"){return d.toLocaleDateString(locale,{year:"numeric",month:"short",day:"2-digit"})}__name(formatDate,"formatDate");function Date2({date,locale}){return jsx8("time",{datetime:date.toISOString(),children:formatDate(date,locale)})}__name(Date2,"Date");import{jsx as jsx9,jsxs as jsxs3}from"preact/jsx-runtime";function byDateAndAlphabeticalFolderFirst(cfg){return(f1,f2)=>{let f1IsFolder=isFolderPath(f1.slug??""),f2IsFolder=isFolderPath(f2.slug??"");if(f1IsFolder&&!f2IsFolder)return-1;if(!f1IsFolder&&f2IsFolder)return 1;if(f1.dates&&f2.dates)return getDate(cfg,f2).getTime()-getDate(cfg,f1).getTime();if(f1.dates&&!f2.dates)return-1;if(!f1.dates&&f2.dates)return 1;let f1Title=f1.frontmatter?.title.toLowerCase()??"",f2Title=f2.frontmatter?.title.toLowerCase()??"";return f1Title.localeCompare(f2Title)}}__name(byDateAndAlphabeticalFolderFirst,"byDateAndAlphabeticalFolderFirst");var PageList=__name(({cfg,fileData,allFiles,limit,sort})=>{let sorter=sort??byDateAndAlphabeticalFolderFirst(cfg),list=allFiles.sort(sorter);return limit&&(list=list.slice(0,limit)),jsx9("ul",{class:"section-ul",children:list.map(page=>{let title=page.frontmatter?.title,tags=page.frontmatter?.tags??[];return jsx9("li",{class:"section-li",children:jsxs3("div",{class:"section",children:[jsx9("p",{class:"meta",children:page.dates&&jsx9(Date2,{date:getDate(cfg,page),locale:cfg.locale})}),jsx9("div",{class:"desc",children:jsx9("h3",{children:jsx9("a",{href:resolveRelative(fileData.slug,page.slug),class:"internal",children:title})})}),jsx9("ul",{class:"tags",children:tags.map(tag=>jsx9("li",{children:jsx9("a",{class:"internal tag-link",href:resolveRelative(fileData.slug,`tags/${tag}`),children:tag})}))})]})})})})},"PageList");PageList.css=`
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`;import{Fragment as Fragment2,jsx as jsx10,jsxs as jsxs4}from"preact/jsx-runtime";var defaultOptions9={numPages:10},TagContent_default=__name((opts=>{let options2={...defaultOptions9,...opts},TagContent=__name(props=>{let{tree,fileData,allFiles,cfg}=props,slug=fileData.slug;if(!(slug?.startsWith("tags/")||slug==="tags"))throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`);let tag=simplifySlug(slug.slice(5)),allPagesWithTag=__name(tag2=>allFiles.filter(file=>(file.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes).includes(tag2)),"allPagesWithTag"),content=tree.children.length===0?fileData.description:htmlToJsx(fileData.filePath,tree),classes=(fileData.frontmatter?.cssclasses??[]).join(" ");if(tag==="/"){let tags=[...new Set(allFiles.flatMap(data=>data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes))].sort((a,b)=>a.localeCompare(b)),tagItemMap=new Map;for(let tag2 of tags)tagItemMap.set(tag2,allPagesWithTag(tag2));return jsxs4("div",{class:"popover-hint",children:[jsx10("article",{class:classes,children:jsx10("p",{children:content})}),jsx10("p",{children:i18n(cfg.locale).pages.tagContent.totalTags({count:tags.length})}),jsx10("div",{children:tags.map(tag2=>{let pages=tagItemMap.get(tag2),listProps={...props,allFiles:pages},contentPage=allFiles.filter(file=>file.slug===`tags/${tag2}`).at(0),root=contentPage?.htmlAst,content2=!root||root?.children.length===0?contentPage?.description:htmlToJsx(contentPage.filePath,root),tagListingPage=`/tags/${tag2}`,href=resolveRelative(fileData.slug,tagListingPage);return jsxs4("div",{children:[jsx10("h2",{children:jsx10("a",{class:"internal tag-link",href,children:tag2})}),content2&&jsx10("p",{children:content2}),jsxs4("div",{class:"page-listing",children:[jsxs4("p",{children:[i18n(cfg.locale).pages.tagContent.itemsUnderTag({count:pages.length}),pages.length>options2.numPages&&jsxs4(Fragment2,{children:[" ",jsx10("span",{children:i18n(cfg.locale).pages.tagContent.showingFirst({count:options2.numPages})})]})]}),jsx10(PageList,{limit:options2.numPages,...listProps,sort:options2?.sort})]})]})})})]})}else{let pages=allPagesWithTag(tag),listProps={...props,allFiles:pages};return jsxs4("div",{class:"popover-hint",children:[jsx10("article",{class:classes,children:content}),jsxs4("div",{class:"page-listing",children:[jsx10("p",{children:i18n(cfg.locale).pages.tagContent.itemsUnderTag({count:pages.length})}),jsx10("div",{children:jsx10(PageList,{...listProps,sort:options2?.sort})})]})]})}},"TagContent");return TagContent.css=concatenateResources(listPage_default,PageList.css),TagContent}),"default");var FileTrieNode=class _FileTrieNode{static{__name(this,"FileTrieNode")}isFolder;children;slugSegments;fileSegmentHint;displayNameOverride;data;constructor(segments,data){this.children=[],this.slugSegments=segments,this.data=data??null,this.isFolder=!1,this.displayNameOverride=void 0}get displayName(){let nonIndexTitle=this.data?.title==="index"?void 0:this.data?.title;return this.displayNameOverride??nonIndexTitle??this.fileSegmentHint??this.slugSegment??""}set displayName(name){this.displayNameOverride=name}get slug(){let path12=joinSegments(...this.slugSegments);return this.isFolder?joinSegments(path12,"index"):path12}get slugSegment(){return this.slugSegments[this.slugSegments.length-1]}makeChild(path12,file){let fullPath=[...this.slugSegments,path12[0]],child=new _FileTrieNode(fullPath,file);return this.children.push(child),child}insert(path12,file){if(path12.length===0)throw new Error("path is empty");this.isFolder=!0;let segment=path12[0];if(path12.length===1)segment==="index"?this.data??=file:this.makeChild(path12,file);else if(path12.length>1){let child=this.children.find(c=>c.slugSegment===segment)??this.makeChild(path12,void 0),fileParts=file.filePath.split("/");child.fileSegmentHint=fileParts.at(-path12.length),child.insert(path12.slice(1),file)}}add(file){this.insert(file.slug.split("/"),file)}findNode(path12){return path12.length===0||path12.length===1&&path12[0]==="index"?this:this.children.find(c=>c.slugSegment===path12[0])?.findNode(path12.slice(1))}ancestryChain(path12){if(path12.length===0||path12.length===1&&path12[0]==="index")return[this];let child=this.children.find(c=>c.slugSegment===path12[0]);if(!child)return;let childPath=child.ancestryChain(path12.slice(1));if(childPath)return[this,...childPath]}filter(filterFn){this.children=this.children.filter(filterFn),this.children.forEach(child=>child.filter(filterFn))}map(mapFn){mapFn(this),this.children.forEach(child=>child.map(mapFn))}sort(sortFn){this.children=this.children.sort(sortFn),this.children.forEach(e=>e.sort(sortFn))}static fromEntries(entries){let trie=new _FileTrieNode([]);return entries.forEach(([,entry])=>trie.add(entry)),trie}entries(){let traverse=__name(node=>[[node.slug,node]].concat(...node.children.map(traverse)),"traverse");return traverse(this)}getFolderPaths(){return this.entries().filter(([_,node])=>node.isFolder).map(([path12,_])=>path12)}};function trieFromAllFiles(allFiles){let trie=new FileTrieNode([]);return allFiles.forEach(file=>{file.frontmatter&&trie.add({...file,slug:file.slug,title:file.frontmatter.title,filePath:file.filePath})}),trie}__name(trieFromAllFiles,"trieFromAllFiles");import{jsx as jsx11,jsxs as jsxs5}from"preact/jsx-runtime";var defaultOptions10={showFolderCount:!0,showSubfolders:!0},FolderContent_default=__name((opts=>{let options2={...defaultOptions10,...opts},FolderContent=__name(props=>{let{tree,fileData,allFiles,cfg}=props,folder=(props.ctx.trie??=trieFromAllFiles(allFiles)).findNode(fileData.slug.split("/"));if(!folder)return null;let allPagesInFolder=folder.children.map(node=>{if(node.data)return node.data;if(node.isFolder&&options2.showSubfolders){let getMostRecentDates=__name(()=>{let maybeDates;for(let child of node.children)child.data?.dates&&(maybeDates?(child.data.dates.created>maybeDates.created&&(maybeDates.created=child.data.dates.created),child.data.dates.modified>maybeDates.modified&&(maybeDates.modified=child.data.dates.modified),child.data.dates.published>maybeDates.published&&(maybeDates.published=child.data.dates.published)):maybeDates={...child.data.dates});return maybeDates??{created:new Date,modified:new Date,published:new Date}},"getMostRecentDates");return{slug:node.slug,dates:getMostRecentDates(),frontmatter:{title:node.displayName,tags:[]}}}}).filter(page=>page!==void 0)??[],classes=(fileData.frontmatter?.cssclasses??[]).join(" "),listProps={...props,sort:options2.sort,allFiles:allPagesInFolder},content=tree.children.length===0?fileData.description:htmlToJsx(fileData.filePath,tree);return jsxs5("div",{class:"popover-hint",children:[jsx11("article",{class:classes,children:content}),jsxs5("div",{class:"page-listing",children:[options2.showFolderCount&&jsx11("p",{children:i18n(cfg.locale).pages.folderContent.itemsUnderFolder({count:allPagesInFolder.length})}),jsx11("div",{children:jsx11(PageList,{...listProps})})]})]})},"FolderContent");return FolderContent.css=concatenateResources(listPage_default,PageList.css),FolderContent}),"default");import{jsx as jsx12,jsxs as jsxs6}from"preact/jsx-runtime";var NotFound=__name(({cfg})=>{let baseDir=new URL(`https://${cfg.baseUrl??"example.com"}`).pathname;return jsxs6("article",{class:"popover-hint",children:[jsx12("h1",{children:"404"}),jsx12("p",{children:i18n(cfg.locale).pages.error.notFound}),jsx12("a",{href:baseDir,children:i18n(cfg.locale).pages.error.home})]})},"NotFound"),__default=__name((()=>NotFound),"default");import{jsx as jsx13}from"preact/jsx-runtime";var ArticleTitle=__name(({fileData,displayClass})=>{let title=fileData.frontmatter?.title;return title?jsx13("h1",{class:classNames(displayClass,"article-title"),children:title}):null},"ArticleTitle");ArticleTitle.css=`
.article-title {
  margin: 2rem 0 0 0;
}
`;var ArticleTitle_default=__name((()=>ArticleTitle),"default");var darkmode_inline_default=`var c=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark",d=localStorage.getItem("theme")??c;document.documentElement.setAttribute("saved-theme",d);var a=t=>{let n=new CustomEvent("themechange",{detail:{theme:t}});document.dispatchEvent(n)};document.addEventListener("nav",()=>{let t=()=>{let e=document.documentElement.getAttribute("saved-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("saved-theme",e),localStorage.setItem("theme",e),a(e)},n=e=>{let m=e.matches?"dark":"light";document.documentElement.setAttribute("saved-theme",m),localStorage.setItem("theme",m),a(m)};for(let e of document.getElementsByClassName("darkmode"))e.addEventListener("click",t),window.addCleanup(()=>e.removeEventListener("click",t));let o=window.matchMedia("(prefers-color-scheme: dark)");o.addEventListener("change",n),window.addCleanup(()=>o.removeEventListener("change",n))});
`;var darkmode_default=`.darkmode {
  cursor: pointer;
  padding: 0;
  position: relative;
  background: none;
  border: none;
  width: 20px;
  height: 32px;
  margin: 0;
  text-align: inherit;
  flex-shrink: 0;
}
.darkmode svg {
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 10px);
  fill: var(--darkgray);
  transition: opacity 0.1s ease;
}

:root[saved-theme=dark] {
  color-scheme: dark;
}

:root[saved-theme=light] {
  color-scheme: light;
}

:root[saved-theme=dark] .darkmode > .dayIcon {
  display: none;
}
:root[saved-theme=dark] .darkmode > .nightIcon {
  display: inline;
}

:root .darkmode > .dayIcon {
  display: inline;
}
:root .darkmode > .nightIcon {
  display: none;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhcmttb2RlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBSUo7RUFDRTs7O0FBR0Y7RUFDRTs7O0FBSUE7RUFDRTs7QUFFRjtFQUNFOzs7QUFLRjtFQUNFOztBQUVGO0VBQ0UiLCJzb3VyY2VzQ29udGVudCI6WyIuZGFya21vZGUge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHBhZGRpbmc6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYmFja2dyb3VuZDogbm9uZTtcbiAgYm9yZGVyOiBub25lO1xuICB3aWR0aDogMjBweDtcbiAgaGVpZ2h0OiAzMnB4O1xuICBtYXJnaW46IDA7XG4gIHRleHQtYWxpZ246IGluaGVyaXQ7XG4gIGZsZXgtc2hyaW5rOiAwO1xuXG4gICYgc3ZnIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgaGVpZ2h0OiAyMHB4O1xuICAgIHRvcDogY2FsYyg1MCUgLSAxMHB4KTtcbiAgICBmaWxsOiB2YXIoLS1kYXJrZ3JheSk7XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjFzIGVhc2U7XG4gIH1cbn1cblxuOnJvb3Rbc2F2ZWQtdGhlbWU9XCJkYXJrXCJdIHtcbiAgY29sb3Itc2NoZW1lOiBkYXJrO1xufVxuXG46cm9vdFtzYXZlZC10aGVtZT1cImxpZ2h0XCJdIHtcbiAgY29sb3Itc2NoZW1lOiBsaWdodDtcbn1cblxuOnJvb3Rbc2F2ZWQtdGhlbWU9XCJkYXJrXCJdIC5kYXJrbW9kZSB7XG4gICYgPiAuZGF5SWNvbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICAmID4gLm5pZ2h0SWNvbiB7XG4gICAgZGlzcGxheTogaW5saW5lO1xuICB9XG59XG5cbjpyb290IC5kYXJrbW9kZSB7XG4gICYgPiAuZGF5SWNvbiB7XG4gICAgZGlzcGxheTogaW5saW5lO1xuICB9XG4gICYgPiAubmlnaHRJY29uIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4iXX0= */`;import{jsx as jsx14,jsxs as jsxs7}from"preact/jsx-runtime";var Darkmode=__name(({displayClass,cfg})=>jsxs7("button",{class:classNames(displayClass,"darkmode"),children:[jsxs7("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",class:"dayIcon",x:"0px",y:"0px",viewBox:"0 0 35 35",style:"enable-background:new 0 0 35 35",xmlSpace:"preserve","aria-label":i18n(cfg.locale).components.themeToggle.darkMode,children:[jsx14("title",{children:i18n(cfg.locale).components.themeToggle.darkMode}),jsx14("path",{d:"M6,17.5C6,16.672,5.328,16,4.5,16h-3C0.672,16,0,16.672,0,17.5    S0.672,19,1.5,19h3C5.328,19,6,18.328,6,17.5z M7.5,26c-0.414,0-0.789,0.168-1.061,0.439l-2,2C4.168,28.711,4,29.086,4,29.5    C4,30.328,4.671,31,5.5,31c0.414,0,0.789-0.168,1.06-0.44l2-2C8.832,28.289,9,27.914,9,27.5C9,26.672,8.329,26,7.5,26z M17.5,6    C18.329,6,19,5.328,19,4.5v-3C19,0.672,18.329,0,17.5,0S16,0.672,16,1.5v3C16,5.328,16.671,6,17.5,6z M27.5,9    c0.414,0,0.789-0.168,1.06-0.439l2-2C30.832,6.289,31,5.914,31,5.5C31,4.672,30.329,4,29.5,4c-0.414,0-0.789,0.168-1.061,0.44    l-2,2C26.168,6.711,26,7.086,26,7.5C26,8.328,26.671,9,27.5,9z M6.439,8.561C6.711,8.832,7.086,9,7.5,9C8.328,9,9,8.328,9,7.5    c0-0.414-0.168-0.789-0.439-1.061l-2-2C6.289,4.168,5.914,4,5.5,4C4.672,4,4,4.672,4,5.5c0,0.414,0.168,0.789,0.439,1.06    L6.439,8.561z M33.5,16h-3c-0.828,0-1.5,0.672-1.5,1.5s0.672,1.5,1.5,1.5h3c0.828,0,1.5-0.672,1.5-1.5S34.328,16,33.5,16z     M28.561,26.439C28.289,26.168,27.914,26,27.5,26c-0.828,0-1.5,0.672-1.5,1.5c0,0.414,0.168,0.789,0.439,1.06l2,2    C28.711,30.832,29.086,31,29.5,31c0.828,0,1.5-0.672,1.5-1.5c0-0.414-0.168-0.789-0.439-1.061L28.561,26.439z M17.5,29    c-0.829,0-1.5,0.672-1.5,1.5v3c0,0.828,0.671,1.5,1.5,1.5s1.5-0.672,1.5-1.5v-3C19,29.672,18.329,29,17.5,29z M17.5,7    C11.71,7,7,11.71,7,17.5S11.71,28,17.5,28S28,23.29,28,17.5S23.29,7,17.5,7z M17.5,25c-4.136,0-7.5-3.364-7.5-7.5    c0-4.136,3.364-7.5,7.5-7.5c4.136,0,7.5,3.364,7.5,7.5C25,21.636,21.636,25,17.5,25z"})]}),jsxs7("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",class:"nightIcon",x:"0px",y:"0px",viewBox:"0 0 100 100",style:"enable-background:new 0 0 100 100",xmlSpace:"preserve","aria-label":i18n(cfg.locale).components.themeToggle.lightMode,children:[jsx14("title",{children:i18n(cfg.locale).components.themeToggle.lightMode}),jsx14("path",{d:"M96.76,66.458c-0.853-0.852-2.15-1.064-3.23-0.534c-6.063,2.991-12.858,4.571-19.655,4.571  C62.022,70.495,50.88,65.88,42.5,57.5C29.043,44.043,25.658,23.536,34.076,6.47c0.532-1.08,0.318-2.379-0.534-3.23  c-0.851-0.852-2.15-1.064-3.23-0.534c-4.918,2.427-9.375,5.619-13.246,9.491c-9.447,9.447-14.65,22.008-14.65,35.369  c0,13.36,5.203,25.921,14.65,35.368s22.008,14.65,35.368,14.65c13.361,0,25.921-5.203,35.369-14.65  c3.872-3.871,7.064-8.328,9.491-13.246C97.826,68.608,97.611,67.309,96.76,66.458z"})]})]}),"Darkmode");Darkmode.beforeDOMLoaded=darkmode_inline_default;Darkmode.css=darkmode_default;var Darkmode_default=__name((()=>Darkmode),"default");var readermode_inline_default=`var n=!1,d=t=>{let e=new CustomEvent("readermodechange",{detail:{mode:t}});document.dispatchEvent(e)};document.addEventListener("nav",()=>{let t=()=>{n=!n;let e=n?"on":"off";document.documentElement.setAttribute("reader-mode",e),d(e)};for(let e of document.getElementsByClassName("readermode"))e.addEventListener("click",t),window.addCleanup(()=>e.removeEventListener("click",t));document.documentElement.setAttribute("reader-mode",n?"on":"off")});
`;var readermode_default=`.readermode {
  cursor: pointer;
  padding: 0;
  position: relative;
  background: none;
  border: none;
  width: 20px;
  height: 32px;
  margin: 0;
  text-align: inherit;
  flex-shrink: 0;
}
.readermode svg {
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 10px);
  fill: var(--darkgray);
  stroke: var(--darkgray);
  transition: opacity 0.1s ease;
}

:root[reader-mode=on] .sidebar.left, :root[reader-mode=on] .sidebar.right {
  opacity: 0;
  transition: opacity 0.2s ease;
}
:root[reader-mode=on] .sidebar.left:hover, :root[reader-mode=on] .sidebar.right:hover {
  opacity: 1;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlYWRlcm1vZGUuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUtGO0VBRUU7RUFDQTs7QUFFQTtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiLnJlYWRlcm1vZGUge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHBhZGRpbmc6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYmFja2dyb3VuZDogbm9uZTtcbiAgYm9yZGVyOiBub25lO1xuICB3aWR0aDogMjBweDtcbiAgaGVpZ2h0OiAzMnB4O1xuICBtYXJnaW46IDA7XG4gIHRleHQtYWxpZ246IGluaGVyaXQ7XG4gIGZsZXgtc2hyaW5rOiAwO1xuXG4gICYgc3ZnIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgaGVpZ2h0OiAyMHB4O1xuICAgIHRvcDogY2FsYyg1MCUgLSAxMHB4KTtcbiAgICBmaWxsOiB2YXIoLS1kYXJrZ3JheSk7XG4gICAgc3Ryb2tlOiB2YXIoLS1kYXJrZ3JheSk7XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjFzIGVhc2U7XG4gIH1cbn1cblxuOnJvb3RbcmVhZGVyLW1vZGU9XCJvblwiXSB7XG4gICYgLnNpZGViYXIubGVmdCxcbiAgJiAuc2lkZWJhci5yaWdodCB7XG4gICAgb3BhY2l0eTogMDtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMnMgZWFzZTtcblxuICAgICY6aG92ZXIge1xuICAgICAgb3BhY2l0eTogMTtcbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;import{jsx as jsx15,jsxs as jsxs8}from"preact/jsx-runtime";var ReaderMode=__name(({displayClass,cfg})=>jsx15("button",{class:classNames(displayClass,"readermode"),children:jsxs8("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",class:"readerIcon",fill:"currentColor",stroke:"currentColor","stroke-width":"0.2","stroke-linecap":"round","stroke-linejoin":"round",width:"64px",height:"64px",viewBox:"0 0 24 24","aria-label":i18n(cfg.locale).components.readerMode.title,children:[jsx15("title",{children:i18n(cfg.locale).components.readerMode.title}),jsx15("g",{transform:"translate(-1.8, -1.8) scale(1.15, 1.2)",children:jsx15("path",{d:"M8.9891247,2.5 C10.1384702,2.5 11.2209868,2.96705384 12.0049645,3.76669482 C12.7883914,2.96705384 13.8709081,2.5 15.0202536,2.5 L18.7549359,2.5 C19.1691495,2.5 19.5049359,2.83578644 19.5049359,3.25 L19.5046891,4.004 L21.2546891,4.00457396 C21.6343849,4.00457396 21.9481801,4.28672784 21.9978425,4.6528034 L22.0046891,4.75457396 L22.0046891,20.25 C22.0046891,20.6296958 21.7225353,20.943491 21.3564597,20.9931534 L21.2546891,21 L2.75468914,21 C2.37499337,21 2.06119817,20.7178461 2.01153575,20.3517706 L2.00468914,20.25 L2.00468914,4.75457396 C2.00468914,4.37487819 2.28684302,4.061083 2.65291858,4.01142057 L2.75468914,4.00457396 L4.50368914,4.004 L4.50444233,3.25 C4.50444233,2.87030423 4.78659621,2.55650904 5.15267177,2.50684662 L5.25444233,2.5 L8.9891247,2.5 Z M4.50368914,5.504 L3.50468914,5.504 L3.50468914,19.5 L10.9478955,19.4998273 C10.4513189,18.9207296 9.73864328,18.5588115 8.96709342,18.5065584 L8.77307039,18.5 L5.25444233,18.5 C4.87474657,18.5 4.56095137,18.2178461 4.51128895,17.8517706 L4.50444233,17.75 L4.50368914,5.504 Z M19.5049359,17.75 C19.5049359,18.1642136 19.1691495,18.5 18.7549359,18.5 L15.2363079,18.5 C14.3910149,18.5 13.5994408,18.8724714 13.0614828,19.4998273 L20.5046891,19.5 L20.5046891,5.504 L19.5046891,5.504 L19.5049359,17.75 Z M18.0059359,3.999 L15.0202536,4 L14.8259077,4.00692283 C13.9889509,4.06666544 13.2254227,4.50975805 12.7549359,5.212 L12.7549359,17.777 L12.7782651,17.7601316 C13.4923805,17.2719483 14.3447024,17 15.2363079,17 L18.0059359,16.999 L18.0056891,4.798 L18.0033792,4.75457396 L18.0056891,4.71 L18.0059359,3.999 Z M8.9891247,4 L6.00368914,3.999 L6.00599909,4.75457396 L6.00599909,4.75457396 L6.00368914,4.783 L6.00368914,16.999 L8.77307039,17 C9.57551536,17 10.3461406,17.2202781 11.0128313,17.6202194 L11.2536891,17.776 L11.2536891,5.211 C10.8200889,4.56369974 10.1361548,4.13636104 9.37521067,4.02745763 L9.18347055,4.00692283 L8.9891247,4 Z"})})]})}),"ReaderMode");ReaderMode.beforeDOMLoaded=readermode_inline_default;ReaderMode.css=readermode_default;var DEFAULT_SANS_SERIF='system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',DEFAULT_MONO="ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace";function getFontSpecificationName(spec){return typeof spec=="string"?spec:spec.name}__name(getFontSpecificationName,"getFontSpecificationName");function formatFontSpecification(type,spec){typeof spec=="string"&&(spec={name:spec});let defaultIncludeWeights=type==="header"?[400,700]:[400,600],defaultIncludeItalic=type==="body",weights=spec.weights??defaultIncludeWeights,italic=spec.includeItalic??defaultIncludeItalic,features=[];if(italic&&features.push("ital"),weights.length>1){let weightSpec=italic?weights.flatMap(w=>[`0,${w}`,`1,${w}`]).sort().join(";"):weights.join(";");features.push(`wght@${weightSpec}`)}return features.length>0?`${spec.name}:${features.join(",")}`:spec.name}__name(formatFontSpecification,"formatFontSpecification");function googleFontHref(theme){let{header,body,code}=theme.typography,headerFont=formatFontSpecification("header",header),bodyFont=formatFontSpecification("body",body),codeFont=formatFontSpecification("code",code);return`https://fonts.googleapis.com/css2?family=${headerFont}&family=${bodyFont}&family=${codeFont}&display=swap`}__name(googleFontHref,"googleFontHref");function googleFontSubsetHref(theme,text){let title=theme.typography.title||theme.typography.header;return`https://fonts.googleapis.com/css2?family=${formatFontSpecification("title",title)}&text=${encodeURIComponent(text)}&display=swap`}__name(googleFontSubsetHref,"googleFontSubsetHref");var fontMimeMap={truetype:"ttf",woff:"woff",woff2:"woff2",opentype:"otf"};async function processGoogleFonts(stylesheet,baseUrl){let fontSourceRegex=/url\((https:\/\/fonts.gstatic.com\/.+(?:\/|(?:kit=))(.+?)[.&].+?)\)\sformat\('(\w+?)'\);/g,fontFiles=[],processedStylesheet=stylesheet,match;for(;(match=fontSourceRegex.exec(stylesheet))!==null;){let url=match[1],filename=match[2],extension=fontMimeMap[match[3].toLowerCase()],staticUrl=`https://${baseUrl}/static/fonts/${filename}.${extension}`;processedStylesheet=processedStylesheet.replace(url,staticUrl),fontFiles.push({url,filename,extension})}return{processedStylesheet,fontFiles}}__name(processGoogleFonts,"processGoogleFonts");function joinStyles(theme,...stylesheet){return`
${stylesheet.join(`

`)}

:root {
  --light: ${theme.colors.lightMode.light};
  --lightgray: ${theme.colors.lightMode.lightgray};
  --gray: ${theme.colors.lightMode.gray};
  --darkgray: ${theme.colors.lightMode.darkgray};
  --dark: ${theme.colors.lightMode.dark};
  --secondary: ${theme.colors.lightMode.secondary};
  --tertiary: ${theme.colors.lightMode.tertiary};
  --highlight: ${theme.colors.lightMode.highlight};
  --textHighlight: ${theme.colors.lightMode.textHighlight};

  --titleFont: "${getFontSpecificationName(theme.typography.title||theme.typography.header)}", ${DEFAULT_SANS_SERIF};
  --headerFont: "${getFontSpecificationName(theme.typography.header)}", ${DEFAULT_SANS_SERIF};
  --bodyFont: "${getFontSpecificationName(theme.typography.body)}", ${DEFAULT_SANS_SERIF};
  --codeFont: "${getFontSpecificationName(theme.typography.code)}", ${DEFAULT_MONO};
}

:root[saved-theme="dark"] {
  --light: ${theme.colors.darkMode.light};
  --lightgray: ${theme.colors.darkMode.lightgray};
  --gray: ${theme.colors.darkMode.gray};
  --darkgray: ${theme.colors.darkMode.darkgray};
  --dark: ${theme.colors.darkMode.dark};
  --secondary: ${theme.colors.darkMode.secondary};
  --tertiary: ${theme.colors.darkMode.tertiary};
  --highlight: ${theme.colors.darkMode.highlight};
  --textHighlight: ${theme.colors.darkMode.textHighlight};
}
`}__name(joinStyles,"joinStyles");import readingTime from"reading-time";import{jsx as jsx16,jsxs as jsxs9}from"preact/jsx-runtime";import sharp from"sharp";import satori from"satori";import path5 from"path";import fs2 from"fs";var write=__name(async({ctx,slug,ext,content})=>{let pathToPage=joinSegments(ctx.argv.output,slug+ext),dir=path5.dirname(pathToPage);return await fs2.promises.mkdir(dir,{recursive:!0}),await fs2.promises.writeFile(pathToPage,content),pathToPage},"write");import{Fragment as Fragment3,jsx as jsx17,jsxs as jsxs10}from"preact/jsx-runtime";var CustomOgImagesEmitterName="CustomOgImages";import{Fragment as Fragment4,jsx as jsx18,jsxs as jsxs11}from"preact/jsx-runtime";var Head_default=__name((()=>__name(({cfg,fileData,externalResources,ctx})=>{let titleSuffix=cfg.pageTitleSuffix??"",title=(fileData.frontmatter?.title??i18n(cfg.locale).propertyDefaults.title)+titleSuffix,description=fileData.frontmatter?.socialDescription??fileData.frontmatter?.description??unescapeHTML(fileData.description?.trim()??i18n(cfg.locale).propertyDefaults.description),{css,js,additionalHead}=externalResources,url=new URL(`https://${cfg.baseUrl??"example.com"}`),path12=url.pathname,baseDir=fileData.slug==="404"?path12:pathToRoot(fileData.slug),iconPath=joinSegments(baseDir,"static/icon.png"),socialUrl=fileData.slug==="404"?url.toString():joinSegments(url.toString(),fileData.slug),usesCustomOgImage=ctx.cfg.plugins.emitters.some(e=>e.name===CustomOgImagesEmitterName),ogImageDefaultPath=`https://${cfg.baseUrl}/static/og-image.png`;return jsxs11("head",{children:[jsx18("title",{children:title}),jsx18("script",{dangerouslySetInnerHTML:{__html:`
                (function() {
                document.documentElement.setAttribute('saved-theme', 'light');
                localStorage.setItem('theme', 'light');
              })();
            `}}),jsx18("meta",{charSet:"utf-8"}),jsx18("meta",{name:"msvalidate.01",content:"85E6BA63EB775FBC7E85536D1760FEDD"}),jsx18("meta",{name:"google-site-verification",content:"ur25qBeKyF6RIfNxQ_bs1h22JTL3SUf_1U5U3gcXGAo"}),cfg.theme.cdnCaching&&cfg.theme.fontOrigin==="googleFonts"&&jsxs11(Fragment4,{children:[jsx18("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),jsx18("link",{rel:"preconnect",href:"https://fonts.gstatic.com"}),jsx18("link",{rel:"stylesheet",href:googleFontHref(cfg.theme)}),cfg.theme.typography.title&&jsx18("link",{rel:"stylesheet",href:googleFontSubsetHref(cfg.theme,cfg.pageTitle)})]}),jsx18("link",{rel:"preconnect",href:"https://cdnjs.cloudflare.com",crossOrigin:"anonymous"}),jsx18("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),jsx18("meta",{name:"og:site_name",content:cfg.pageTitle}),jsx18("meta",{property:"og:title",content:title}),jsx18("meta",{property:"og:type",content:"website"}),jsx18("meta",{name:"twitter:card",content:"summary_large_image"}),jsx18("meta",{name:"twitter:title",content:title}),jsx18("meta",{name:"twitter:description",content:description}),jsx18("meta",{property:"og:description",content:description}),jsx18("meta",{property:"og:image:alt",content:description}),!usesCustomOgImage&&jsxs11(Fragment4,{children:[jsx18("meta",{property:"og:image",content:ogImageDefaultPath}),jsx18("meta",{property:"og:image:url",content:ogImageDefaultPath}),jsx18("meta",{name:"twitter:image",content:ogImageDefaultPath}),jsx18("meta",{property:"og:image:type",content:`image/${getFileExtension(ogImageDefaultPath)??"png"}`})]}),cfg.baseUrl&&jsxs11(Fragment4,{children:[jsx18("meta",{property:"twitter:domain",content:cfg.baseUrl}),jsx18("meta",{property:"og:url",content:socialUrl}),jsx18("meta",{property:"twitter:url",content:socialUrl})]}),jsx18("link",{rel:"icon",href:iconPath}),jsx18("meta",{name:"description",content:description}),jsx18("meta",{name:"generator",content:"Quartz"}),css.map(resource=>CSSResourceToStyleElement(resource,!0)),js.filter(resource=>resource.loadTime==="beforeDOMReady").map(res=>JSResourceToScriptElement(res,!0)),additionalHead.map(resource=>typeof resource=="function"?resource(fileData):resource)]})},"Head")),"default");import{jsx as jsx19}from"preact/jsx-runtime";var PageTitle=__name(({fileData,cfg,displayClass})=>{let title=cfg?.pageTitle??i18n(cfg.locale).propertyDefaults.title,baseDir=pathToRoot(fileData.slug);return jsx19("h2",{class:classNames(displayClass,"page-title"),children:jsx19("a",{href:baseDir,children:title})})},"PageTitle");PageTitle.css=`
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
`;var PageTitle_default=__name((()=>PageTitle),"default");import readingTime2 from"reading-time";var contentMeta_default=`.content-meta {
  margin-top: 0;
  color: var(--darkgray);
}
.content-meta[show-comma=true] > *:not(:last-child) {
  margin-right: 8px;
}
.content-meta[show-comma=true] > *:not(:last-child)::after {
  content: ",";
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRNZXRhLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBOztBQUdFO0VBQ0U7O0FBRUE7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbIi5jb250ZW50LW1ldGEge1xuICBtYXJnaW4tdG9wOiAwO1xuICBjb2xvcjogdmFyKC0tZGFya2dyYXkpO1xuXG4gICZbc2hvdy1jb21tYT1cInRydWVcIl0ge1xuICAgID4gKjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgIG1hcmdpbi1yaWdodDogOHB4O1xuXG4gICAgICAmOjphZnRlciB7XG4gICAgICAgIGNvbnRlbnQ6IFwiLFwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19 */`;import{jsx as jsx20}from"preact/jsx-runtime";var defaultOptions11={showReadingTime:!0,showComma:!0},ContentMeta_default=__name((opts=>{let options2={...defaultOptions11,...opts};function ContentMetadata({cfg,fileData,displayClass}){let text=fileData.text;if(text){let segments=[];if(fileData.dates&&segments.push(jsx20(Date2,{date:getDate(cfg,fileData),locale:cfg.locale})),options2.showReadingTime){let{minutes,words:_words}=readingTime2(text),displayedTime=i18n(cfg.locale).components.contentMeta.readingTime({minutes:Math.ceil(minutes)});segments.push(jsx20("span",{children:displayedTime}))}return jsx20("p",{"show-comma":options2.showComma,class:classNames(displayClass,"content-meta"),children:segments})}else return null}return __name(ContentMetadata,"ContentMetadata"),ContentMetadata.css=contentMeta_default,ContentMetadata}),"default");import{jsx as jsx21}from"preact/jsx-runtime";var legacyToc_default=`details.toc summary {
  cursor: pointer;
}
details.toc summary::marker {
  color: var(--dark);
}
details.toc summary > * {
  padding-left: 0.25rem;
  display: inline-block;
  margin: 0;
}
details.toc ul {
  list-style: none;
  margin: 0.5rem 1.25rem;
  padding: 0;
}
details.toc .depth-1 {
  padding-left: calc(1rem * 1);
}
details.toc .depth-2 {
  padding-left: calc(1rem * 2);
}
details.toc .depth-3 {
  padding-left: calc(1rem * 3);
}
details.toc .depth-4 {
  padding-left: calc(1rem * 4);
}
details.toc .depth-5 {
  padding-left: calc(1rem * 5);
}
details.toc .depth-6 {
  padding-left: calc(1rem * 6);
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxlZ2FjeVRvYy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNFO0VBQ0U7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFJSjtFQUNFO0VBQ0E7RUFDQTs7QUFJQTtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRTs7QUFERjtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbImRldGFpbHMudG9jIHtcbiAgJiBzdW1tYXJ5IHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAmOjptYXJrZXIge1xuICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgIH1cblxuICAgICYgPiAqIHtcbiAgICAgIHBhZGRpbmctbGVmdDogMC4yNXJlbTtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIG1hcmdpbjogMDtcbiAgICB9XG4gIH1cblxuICAmIHVsIHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgIG1hcmdpbjogMC41cmVtIDEuMjVyZW07XG4gICAgcGFkZGluZzogMDtcbiAgfVxuXG4gIEBmb3IgJGkgZnJvbSAxIHRocm91Z2ggNiB7XG4gICAgJiAuZGVwdGgtI3skaX0ge1xuICAgICAgcGFkZGluZy1sZWZ0OiBjYWxjKDFyZW0gKiAjeyRpfSk7XG4gICAgfVxuICB9XG59XG4iXX0= */`;var toc_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
.toc {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  min-height: 1.4rem;
  flex: 0 0.5 auto;
}
.toc:has(button.toc-header.collapsed) {
  flex: 0 1 1.4rem;
}

button.toc-header {
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 0;
  color: var(--dark);
  display: flex;
  align-items: center;
}
button.toc-header h3 {
  font-size: 1rem;
  display: inline-block;
  margin: 0;
}
button.toc-header .fold {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  opacity: 0.8;
}
button.toc-header.collapsed .fold {
  transform: rotateZ(-90deg);
}

ul.toc-content.overflow {
  list-style: none;
  position: relative;
  margin: 0.5rem 0;
  padding: 0;
  max-height: calc(100% - 2rem);
  overscroll-behavior: contain;
  list-style: none;
}
ul.toc-content.overflow > li > a {
  color: var(--dark);
  opacity: 0.35;
  transition: 0.5s ease opacity, 0.3s ease color;
}
ul.toc-content.overflow > li > a.in-view {
  opacity: 0.75;
}
ul.toc-content.overflow .depth-0 {
  padding-left: calc(1rem * 0);
}
ul.toc-content.overflow .depth-1 {
  padding-left: calc(1rem * 1);
}
ul.toc-content.overflow .depth-2 {
  padding-left: calc(1rem * 2);
}
ul.toc-content.overflow .depth-3 {
  padding-left: calc(1rem * 3);
}
ul.toc-content.overflow .depth-4 {
  padding-left: calc(1rem * 4);
}
ul.toc-content.overflow .depth-5 {
  padding-left: calc(1rem * 5);
}
ul.toc-content.overflow .depth-6 {
  padding-left: calc(1rem * 6);
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2NzcyIsInRvYy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FDQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUNBO0VBQ0U7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBLFlBQ0U7O0FBRUY7RUFDRTs7QUFLRjtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRTs7QUFERjtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRTs7QUFERjtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcInNhc3M6bWFwXCI7XG5cbi8qKlxuICogTGF5b3V0IGJyZWFrcG9pbnRzXG4gKiAkbW9iaWxlOiBzY3JlZW4gd2lkdGggYmVsb3cgdGhpcyB2YWx1ZSB3aWxsIHVzZSBtb2JpbGUgc3R5bGVzXG4gKiAkZGVza3RvcDogc2NyZWVuIHdpZHRoIGFib3ZlIHRoaXMgdmFsdWUgd2lsbCB1c2UgZGVza3RvcCBzdHlsZXNcbiAqIFNjcmVlbiB3aWR0aCBiZXR3ZWVuICRtb2JpbGUgYW5kICRkZXNrdG9wIHdpZHRoIHdpbGwgdXNlIHRoZSB0YWJsZXQgbGF5b3V0LlxuICogYXNzdW1pbmcgbW9iaWxlIDwgZGVza3RvcFxuICovXG4kYnJlYWtwb2ludHM6IChcbiAgbW9iaWxlOiA4MDBweCxcbiAgZGVza3RvcDogMTIwMHB4LFxuKTtcblxuJG1vYmlsZTogXCIobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSlcIjtcbiR0YWJsZXQ6IFwiKG1pbi13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX0pIGFuZCAobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG4kZGVza3RvcDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG5cbiRwYWdlV2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9O1xuJHNpZGVQYW5lbFdpZHRoOiAzMjBweDsgLy8zODBweDtcbiR0b3BTcGFjaW5nOiA2cmVtO1xuJGJvbGRXZWlnaHQ6IDcwMDtcbiRzZW1pQm9sZFdlaWdodDogNjAwO1xuJG5vcm1hbFdlaWdodDogNDAwO1xuXG4kbW9iaWxlR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCJhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0XCJcXFxuICAgICAgXCJncmlkLWhlYWRlclwiXFxcbiAgICAgIFwiZ3JpZC1jZW50ZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1mb290ZXJcIicsXG4pO1xuJHRhYmxldEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWZvb3RlclwiJyxcbik7XG4kZGVza3RvcEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCIjeyRzaWRlUGFuZWxXaWR0aH0gYXV0byAjeyRzaWRlUGFuZWxXaWR0aH1cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyIGdyaWQtc2lkZWJhci1yaWdodFwiJyxcbik7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcblxuLnRvYyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIG92ZXJmbG93LXk6IGhpZGRlbjtcbiAgbWluLWhlaWdodDogMS40cmVtO1xuICBmbGV4OiAwIDAuNSBhdXRvO1xuICAmOmhhcyhidXR0b24udG9jLWhlYWRlci5jb2xsYXBzZWQpIHtcbiAgICBmbGV4OiAwIDEgMS40cmVtO1xuICB9XG59XG5cbmJ1dHRvbi50b2MtaGVhZGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogbm9uZTtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAwO1xuICBjb2xvcjogdmFyKC0tZGFyayk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgJiBoMyB7XG4gICAgZm9udC1zaXplOiAxcmVtO1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBtYXJnaW46IDA7XG4gIH1cblxuICAmIC5mb2xkIHtcbiAgICBtYXJnaW4tbGVmdDogMC41cmVtO1xuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XG4gICAgb3BhY2l0eTogMC44O1xuICB9XG5cbiAgJi5jb2xsYXBzZWQgLmZvbGQge1xuICAgIHRyYW5zZm9ybTogcm90YXRlWigtOTBkZWcpO1xuICB9XG59XG5cbnVsLnRvYy1jb250ZW50Lm92ZXJmbG93IHtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBtYXJnaW46IDAuNXJlbSAwO1xuICBwYWRkaW5nOiAwO1xuICBtYXgtaGVpZ2h0OiBjYWxjKDEwMCUgLSAycmVtKTtcbiAgb3ZlcnNjcm9sbC1iZWhhdmlvcjogY29udGFpbjtcbiAgbGlzdC1zdHlsZTogbm9uZTtcblxuICAmID4gbGkgPiBhIHtcbiAgICBjb2xvcjogdmFyKC0tZGFyayk7XG4gICAgb3BhY2l0eTogMC4zNTtcbiAgICB0cmFuc2l0aW9uOlxuICAgICAgMC41cyBlYXNlIG9wYWNpdHksXG4gICAgICAwLjNzIGVhc2UgY29sb3I7XG4gICAgJi5pbi12aWV3IHtcbiAgICAgIG9wYWNpdHk6IDAuNzU7XG4gICAgfVxuICB9XG5cbiAgQGZvciAkaSBmcm9tIDAgdGhyb3VnaCA2IHtcbiAgICAmIC5kZXB0aC0jeyRpfSB7XG4gICAgICBwYWRkaW5nLWxlZnQ6IGNhbGMoMXJlbSAqICN7JGl9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;var toc_inline_default='var i=new IntersectionObserver(t=>{for(let e of t){let n=e.target.id,o=document.querySelectorAll(`a[data-for="${n}"]`),c=e.rootBounds?.height;c&&o.length>0&&(e.boundingClientRect.y<c?o.forEach(s=>s.classList.add("in-view")):o.forEach(s=>s.classList.remove("in-view")))}});function r(){this.classList.toggle("collapsed"),this.setAttribute("aria-expanded",this.getAttribute("aria-expanded")==="true"?"false":"true");let t=this.nextElementSibling;t&&t.classList.toggle("collapsed")}function d(){for(let t of document.getElementsByClassName("toc")){let e=t.querySelector(".toc-header"),n=t.querySelector(".toc-content");if(!e||!n)return;e.addEventListener("click",r),window.addCleanup(()=>e.removeEventListener("click",r))}}document.addEventListener("nav",()=>{d(),i.disconnect(),document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]").forEach(e=>i.observe(e))});\n';import{jsx as jsx22,jsxs as jsxs12}from"preact/jsx-runtime";var OverflowList=__name(({children,...props})=>jsxs12("ul",{...props,class:[props.class,"overflow"].filter(Boolean).join(" "),id:props.id,children:[children,jsx22("li",{class:"overflow-end"})]}),"OverflowList"),numLists=0,OverflowList_default=__name(()=>{let id=`list-${numLists++}`;return{OverflowList:__name(props=>jsx22(OverflowList,{...props,id}),"OverflowList"),overflowListAfterDOMLoaded:`
document.addEventListener("nav", (e) => {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const parentUl = entry.target.parentElement
      if (!parentUl) return
      if (entry.isIntersecting) {
        parentUl.classList.remove("gradient-active")
      } else {
        parentUl.classList.add("gradient-active")
      }
    }
  })

  const ul = document.getElementById("${id}")
  if (!ul) return

  const end = ul.querySelector(".overflow-end")
  if (!end) return

  observer.observe(end)
  window.addCleanup(() => observer.disconnect())
})
`}},"default");import{jsx as jsx23,jsxs as jsxs13}from"preact/jsx-runtime";var defaultOptions12={layout:"modern"},numTocs=0,TableOfContents_default=__name((opts=>{let layout=opts?.layout??defaultOptions12.layout,{OverflowList:OverflowList2,overflowListAfterDOMLoaded}=OverflowList_default(),TableOfContents2=__name(({fileData,displayClass,cfg})=>{if(!fileData.toc)return null;let id=`toc-${numTocs++}`;return jsxs13("div",{class:classNames(displayClass,"toc"),children:[jsxs13("button",{type:"button",class:fileData.collapseToc?"collapsed toc-header":"toc-header","aria-controls":id,"aria-expanded":!fileData.collapseToc,children:[jsx23("h3",{children:i18n(cfg.locale).components.tableOfContents.title}),jsx23("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"fold",children:jsx23("polyline",{points:"6 9 12 15 18 9"})})]}),jsx23(OverflowList2,{id,class:fileData.collapseToc?"collapsed toc-content":"toc-content",children:fileData.toc.map(tocEntry=>jsx23("li",{class:`depth-${tocEntry.depth}`,children:jsx23("a",{href:`#${tocEntry.slug}`,"data-for":tocEntry.slug,children:tocEntry.text})},tocEntry.slug))})]})},"TableOfContents");TableOfContents2.css=toc_default,TableOfContents2.afterDOMLoaded=concatenateResources(toc_inline_default,overflowListAfterDOMLoaded);let LegacyTableOfContents=__name(({fileData,cfg})=>fileData.toc?jsxs13("details",{class:"toc",open:!fileData.collapseToc,children:[jsx23("summary",{children:jsx23("h3",{children:i18n(cfg.locale).components.tableOfContents.title})}),jsx23("ul",{children:fileData.toc.map(tocEntry=>jsx23("li",{class:`depth-${tocEntry.depth}`,children:jsx23("a",{href:`#${tocEntry.slug}`,"data-for":tocEntry.slug,children:tocEntry.text})},tocEntry.slug))})]}):null,"LegacyTableOfContents");return LegacyTableOfContents.css=legacyToc_default,layout==="modern"?TableOfContents2:LegacyTableOfContents}),"default");var explorer_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
@media all and ((max-width: 800px)) {
  .page > #quartz-body > :not(.sidebar.left:has(.explorer)) {
    transition: transform 300ms ease-in-out;
  }
  .page > #quartz-body.lock-scroll > :not(.sidebar.left:has(.explorer)) {
    transform: translateX(100dvw);
    transition: transform 300ms ease-in-out;
  }
  .page > #quartz-body .sidebar.left:has(.explorer) {
    box-sizing: border-box;
    position: sticky;
    background-color: var(--light);
    padding: 1rem 0 1rem 0;
    margin: 0;
  }
  .page > #quartz-body .hide-until-loaded ~ .explorer-content {
    display: none;
  }
}
.explorer {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  min-height: 1.2rem;
  flex: 0 1 auto;
}
.explorer.collapsed {
  flex: 0 1 1.2rem;
}
.explorer.collapsed .fold {
  transform: rotateZ(-90deg);
}
.explorer .fold {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  opacity: 0.8;
}
@media all and ((max-width: 800px)) {
  .explorer {
    order: -1;
    height: initial;
    overflow: hidden;
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: auto;
    margin-bottom: auto;
  }
}
.explorer button.mobile-explorer {
  display: none;
}
.explorer button.desktop-explorer {
  display: flex;
}
@media all and ((max-width: 800px)) {
  .explorer button.mobile-explorer {
    display: flex;
  }
  .explorer button.desktop-explorer {
    display: none;
  }
}
@media all and not ((max-width: 800px)) {
  .explorer.desktop-only {
    display: flex;
  }
}
.explorer svg {
  pointer-events: all;
  transition: transform 0.35s ease;
}
.explorer svg > polyline {
  pointer-events: none;
}

button.mobile-explorer,
button.desktop-explorer {
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 0;
  color: var(--dark);
  display: flex;
  align-items: center;
}
button.mobile-explorer h2,
button.desktop-explorer h2 {
  font-size: 1rem;
  display: inline-block;
  margin: 0;
}

.explorer-content {
  list-style: none;
  overflow: hidden;
  overflow-y: auto;
  margin-top: 0.5rem;
}
.explorer-content ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.explorer-content ul.explorer-ul {
  overscroll-behavior: contain;
}
.explorer-content ul li > a {
  color: var(--dark);
  opacity: 0.75;
  pointer-events: all;
}
.explorer-content ul li > a.active {
  opacity: 1;
  color: var(--tertiary);
}
.explorer-content .folder-outer {
  visibility: collapse;
  display: grid;
  grid-template-rows: 0fr;
  transition-property: grid-template-rows, visibility;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
}
.explorer-content .folder-outer.open {
  visibility: visible;
  grid-template-rows: 1fr;
}
.explorer-content .folder-outer > ul {
  overflow: hidden;
  margin-left: 6px;
  padding-left: 0.8rem;
  border-left: 1px solid var(--lightgray);
}

.folder-container {
  flex-direction: row;
  display: flex;
  align-items: center;
  user-select: none;
}
.folder-container div > a {
  color: var(--secondary);
  font-family: var(--headerFont);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.5rem;
  display: inline-block;
}
.folder-container div > a:hover {
  color: var(--tertiary);
}
.folder-container div > button {
  color: var(--dark);
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  padding-left: 0;
  padding-right: 0;
  display: flex;
  align-items: center;
  font-family: var(--headerFont);
}
.folder-container div > button span {
  font-size: 0.95rem;
  display: inline-block;
  color: var(--secondary);
  font-weight: 600;
  margin: 0;
  line-height: 1.5rem;
  pointer-events: none;
}

.folder-icon {
  margin-right: 5px;
  color: var(--secondary);
  cursor: pointer;
  transition: transform 0.3s ease;
  backface-visibility: visible;
  flex-shrink: 0;
}

li:has(> .folder-outer:not(.open)) > .folder-container > svg {
  transform: rotate(-90deg);
}

.folder-icon:hover {
  color: var(--tertiary);
}

@media all and ((max-width: 800px)) {
  .explorer.collapsed {
    flex: 0 0 34px;
  }
  .explorer.collapsed > .explorer-content {
    transform: translateX(-100vw);
    visibility: hidden;
  }
  .explorer:not(.collapsed) {
    flex: 0 0 34px;
  }
  .explorer:not(.collapsed) > .explorer-content {
    transform: translateX(0);
    visibility: visible;
  }
  .explorer .explorer-content {
    box-sizing: border-box;
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 0;
    background-color: var(--light);
    max-width: 100vw;
    width: 100vw;
    transform: translateX(-100vw);
    transition: transform 200ms ease, visibility 200ms ease;
    overflow: hidden;
    padding: 4rem 0 2rem 0;
    height: 100dvh;
    max-height: 100dvh;
    visibility: hidden;
  }
  .explorer .mobile-explorer {
    margin: 0;
    padding: 5px;
    z-index: 101;
  }
  .explorer .mobile-explorer .lucide-menu {
    stroke: var(--darkgray);
  }
}

@media all and ((max-width: 800px)) {
  .mobile-no-scroll .explorer-content > .explorer-ul {
    overscroll-behavior: contain;
  }
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2NzcyIsImV4cGxvcmVyLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUNBQTtFQUdJO0lBQ0U7O0VBR0Y7SUFDRTtJQUNBOztFQUlGO0lBQ0U7SUFDQTtJQUNBO0lBQ0E7SUFDQTs7RUFHRjtJQUNFOzs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUVBO0VBQ0E7O0FBRUE7RUFDRTs7QUFFQTtFQUNFOztBQUlKO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBdEJGO0lBdUJJO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOzs7QUFHRjtFQUNFOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtJQUNFOztFQUdGO0lBQ0U7OztBQUtGO0VBREY7SUFFSTs7O0FBSUo7RUFDRTtFQUNBOztBQUVBO0VBQ0U7OztBQUtOO0FBQUE7RUFFRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0FBQUE7RUFDRTtFQUNBO0VBQ0E7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBS047RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQSxhRHRKYTtFQ3VKYjtFQUNBOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBLGFEL0tXO0VDZ0xYO0VBQ0E7RUFDQTs7O0FBS047RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7OztBQUdGO0VBQ0U7OztBQUlBO0VBQ0U7SUFDRTs7RUFFQTtJQUNFO0lBQ0E7O0VBSUo7SUFDRTs7RUFFQTtJQUNFO0lBQ0E7O0VBSUo7SUFDRTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFlBQ0U7SUFFRjtJQUNBO0lBQ0E7SUFDQTtJQUNBOztFQUdGO0lBQ0U7SUFDQTtJQUNBOztFQUVBO0lBQ0U7Ozs7QUFPTjtFQUNFO0lBQ0UiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwic2FzczptYXBcIjtcblxuLyoqXG4gKiBMYXlvdXQgYnJlYWtwb2ludHNcbiAqICRtb2JpbGU6IHNjcmVlbiB3aWR0aCBiZWxvdyB0aGlzIHZhbHVlIHdpbGwgdXNlIG1vYmlsZSBzdHlsZXNcbiAqICRkZXNrdG9wOiBzY3JlZW4gd2lkdGggYWJvdmUgdGhpcyB2YWx1ZSB3aWxsIHVzZSBkZXNrdG9wIHN0eWxlc1xuICogU2NyZWVuIHdpZHRoIGJldHdlZW4gJG1vYmlsZSBhbmQgJGRlc2t0b3Agd2lkdGggd2lsbCB1c2UgdGhlIHRhYmxldCBsYXlvdXQuXG4gKiBhc3N1bWluZyBtb2JpbGUgPCBkZXNrdG9wXG4gKi9cbiRicmVha3BvaW50czogKFxuICBtb2JpbGU6IDgwMHB4LFxuICBkZXNrdG9wOiAxMjAwcHgsXG4pO1xuXG4kbW9iaWxlOiBcIihtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9KVwiO1xuJHRhYmxldDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSkgYW5kIChtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcbiRkZXNrdG9wOiBcIihtaW4td2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcblxuJHBhZ2VXaWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX07XG4kc2lkZVBhbmVsV2lkdGg6IDMyMHB4OyAvLzM4MHB4O1xuJHRvcFNwYWNpbmc6IDZyZW07XG4kYm9sZFdlaWdodDogNzAwO1xuJHNlbWlCb2xkV2VpZ2h0OiA2MDA7XG4kbm9ybWFsV2VpZ2h0OiA0MDA7XG5cbiRtb2JpbGVHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcImF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnRcIlxcXG4gICAgICBcImdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLWZvb3RlclwiJyxcbik7XG4kdGFibGV0R3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiI3skc2lkZVBhbmVsV2lkdGh9IGF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyXCInLFxuKTtcbiRkZXNrdG9wR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvICN7JHNpZGVQYW5lbFdpZHRofVwiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWhlYWRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyIGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1mb290ZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCInLFxuKTtcbiIsIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuXG5AbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAucGFnZSA+ICNxdWFydHotYm9keSB7XG4gICAgLy8gU2hpZnQgcGFnZSBwb3NpdGlvbiB3aGVuIHRvZ2dsaW5nIEV4cGxvcmVyIG9uIG1vYmlsZS5cbiAgICAmID4gOm5vdCguc2lkZWJhci5sZWZ0OmhhcyguZXhwbG9yZXIpKSB7XG4gICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMzAwbXMgZWFzZS1pbi1vdXQ7XG4gICAgfVxuXG4gICAgJi5sb2NrLXNjcm9sbCA+IDpub3QoLnNpZGViYXIubGVmdDpoYXMoLmV4cGxvcmVyKSkge1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMGR2dyk7XG4gICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMzAwbXMgZWFzZS1pbi1vdXQ7XG4gICAgfVxuXG4gICAgLy8gU3RpY2t5IHRvcCBiYXIgKHN0YXlzIGluIHBsYWNlIHdoZW4gc2Nyb2xsaW5nIGRvd24gb24gbW9iaWxlKS5cbiAgICAuc2lkZWJhci5sZWZ0OmhhcyguZXhwbG9yZXIpIHtcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICBwb3NpdGlvbjogc3RpY2t5O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICAgICAgcGFkZGluZzogMXJlbSAwIDFyZW0gMDtcbiAgICAgIG1hcmdpbjogMDtcbiAgICB9XG5cbiAgICAuaGlkZS11bnRpbC1sb2FkZWQgfiAuZXhwbG9yZXItY29udGVudCB7XG4gICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cbiAgfVxufVxuXG4uZXhwbG9yZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBvdmVyZmxvdy15OiBoaWRkZW47XG5cbiAgbWluLWhlaWdodDogMS4ycmVtO1xuICBmbGV4OiAwIDEgYXV0bztcblxuICAmLmNvbGxhcHNlZCB7XG4gICAgZmxleDogMCAxIDEuMnJlbTtcblxuICAgICYgLmZvbGQge1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGVaKC05MGRlZyk7XG4gICAgfVxuICB9XG5cbiAgJiAuZm9sZCB7XG4gICAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xuICAgIG9wYWNpdHk6IDAuODtcbiAgfVxuXG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgb3JkZXI6IC0xO1xuICAgIGhlaWdodDogaW5pdGlhbDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XG4gICAgbWFyZ2luLXRvcDogYXV0bztcbiAgICBtYXJnaW4tYm90dG9tOiBhdXRvO1xuICB9XG5cbiAgYnV0dG9uLm1vYmlsZS1leHBsb3JlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuXG4gIGJ1dHRvbi5kZXNrdG9wLWV4cGxvcmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICB9XG5cbiAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICBidXR0b24ubW9iaWxlLWV4cGxvcmVyIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuXG4gICAgYnV0dG9uLmRlc2t0b3AtZXhwbG9yZXIge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gIH1cblxuICAmLmRlc2t0b3Atb25seSB7XG4gICAgQG1lZGlhIGFsbCBhbmQgbm90ICgkbW9iaWxlKSB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgIH1cbiAgfVxuXG4gIHN2ZyB7XG4gICAgcG9pbnRlci1ldmVudHM6IGFsbDtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zNXMgZWFzZTtcblxuICAgICYgPiBwb2x5bGluZSB7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB9XG4gIH1cbn1cblxuYnV0dG9uLm1vYmlsZS1leHBsb3JlcixcbmJ1dHRvbi5kZXNrdG9wLWV4cGxvcmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogbm9uZTtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAwO1xuICBjb2xvcjogdmFyKC0tZGFyayk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgJiBoMiB7XG4gICAgZm9udC1zaXplOiAxcmVtO1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBtYXJnaW46IDA7XG4gIH1cbn1cblxuLmV4cGxvcmVyLWNvbnRlbnQge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICBtYXJnaW4tdG9wOiAwLjVyZW07XG5cbiAgJiB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcblxuICAgICYuZXhwbG9yZXItdWwge1xuICAgICAgb3ZlcnNjcm9sbC1iZWhhdmlvcjogY29udGFpbjtcbiAgICB9XG5cbiAgICAmIGxpID4gYSB7XG4gICAgICBjb2xvcjogdmFyKC0tZGFyayk7XG4gICAgICBvcGFjaXR5OiAwLjc1O1xuICAgICAgcG9pbnRlci1ldmVudHM6IGFsbDtcblxuICAgICAgJi5hY3RpdmUge1xuICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICBjb2xvcjogdmFyKC0tdGVydGlhcnkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC5mb2xkZXItb3V0ZXIge1xuICAgIHZpc2liaWxpdHk6IGNvbGxhcHNlO1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAwZnI7XG4gICAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogZ3JpZC10ZW1wbGF0ZS1yb3dzLCB2aXNpYmlsaXR5O1xuICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDAuM3M7XG4gICAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2UtaW4tb3V0O1xuICB9XG5cbiAgLmZvbGRlci1vdXRlci5vcGVuIHtcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICAgIGdyaWQtdGVtcGxhdGUtcm93czogMWZyO1xuICB9XG5cbiAgLmZvbGRlci1vdXRlciA+IHVsIHtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIG1hcmdpbi1sZWZ0OiA2cHg7XG4gICAgcGFkZGluZy1sZWZ0OiAwLjhyZW07XG4gICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICB9XG59XG5cbi5mb2xkZXItY29udGFpbmVyIHtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgJiBkaXYgPiBhIHtcbiAgICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICBmb250LWZhbWlseTogdmFyKC0taGVhZGVyRm9udCk7XG4gICAgZm9udC1zaXplOiAwLjk1cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiAkc2VtaUJvbGRXZWlnaHQ7XG4gICAgbGluZS1oZWlnaHQ6IDEuNXJlbTtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIH1cblxuICAmIGRpdiA+IGE6aG92ZXIge1xuICAgIGNvbG9yOiB2YXIoLS10ZXJ0aWFyeSk7XG4gIH1cblxuICAmIGRpdiA+IGJ1dHRvbiB7XG4gICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgcGFkZGluZy1yaWdodDogMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWhlYWRlckZvbnQpO1xuXG4gICAgJiBzcGFuIHtcbiAgICAgIGZvbnQtc2l6ZTogMC45NXJlbTtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICAgICAgZm9udC13ZWlnaHQ6ICRzZW1pQm9sZFdlaWdodDtcbiAgICAgIG1hcmdpbjogMDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxLjVyZW07XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB9XG4gIH1cbn1cblxuLmZvbGRlci1pY29uIHtcbiAgbWFyZ2luLXJpZ2h0OiA1cHg7XG4gIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XG4gIGJhY2tmYWNlLXZpc2liaWxpdHk6IHZpc2libGU7XG4gIGZsZXgtc2hyaW5rOiAwO1xufVxuXG5saTpoYXMoPiAuZm9sZGVyLW91dGVyOm5vdCgub3BlbikpID4gLmZvbGRlci1jb250YWluZXIgPiBzdmcge1xuICB0cmFuc2Zvcm06IHJvdGF0ZSgtOTBkZWcpO1xufVxuXG4uZm9sZGVyLWljb246aG92ZXIge1xuICBjb2xvcjogdmFyKC0tdGVydGlhcnkpO1xufVxuXG4uZXhwbG9yZXIge1xuICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICYuY29sbGFwc2VkIHtcbiAgICAgIGZsZXg6IDAgMCAzNHB4O1xuXG4gICAgICAmID4gLmV4cGxvcmVyLWNvbnRlbnQge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTEwMHZ3KTtcbiAgICAgICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgICAgfVxuICAgIH1cblxuICAgICY6bm90KC5jb2xsYXBzZWQpIHtcbiAgICAgIGZsZXg6IDAgMCAzNHB4O1xuXG4gICAgICAmID4gLmV4cGxvcmVyLWNvbnRlbnQge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7XG4gICAgICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLmV4cGxvcmVyLWNvbnRlbnQge1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIHotaW5kZXg6IDEwMDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogMDtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICBtYXJnaW4tdG9wOiAwO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICAgICAgbWF4LXdpZHRoOiAxMDB2dztcbiAgICAgIHdpZHRoOiAxMDB2dztcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwdncpO1xuICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgdHJhbnNmb3JtIDIwMG1zIGVhc2UsXG4gICAgICAgIHZpc2liaWxpdHkgMjAwbXMgZWFzZTtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICBwYWRkaW5nOiA0cmVtIDAgMnJlbSAwO1xuICAgICAgaGVpZ2h0OiAxMDBkdmg7XG4gICAgICBtYXgtaGVpZ2h0OiAxMDBkdmg7XG4gICAgICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gICAgfVxuXG4gICAgLm1vYmlsZS1leHBsb3JlciB7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBwYWRkaW5nOiA1cHg7XG4gICAgICB6LWluZGV4OiAxMDE7XG5cbiAgICAgIC5sdWNpZGUtbWVudSB7XG4gICAgICAgIHN0cm9rZTogdmFyKC0tZGFya2dyYXkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4ubW9iaWxlLW5vLXNjcm9sbCB7XG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgLmV4cGxvcmVyLWNvbnRlbnQgPiAuZXhwbG9yZXItdWwge1xuICAgICAgb3ZlcnNjcm9sbC1iZWhhdmlvcjogY29udGFpbjtcbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;var explorer_inline_default=`var M=Object.create;var y=Object.defineProperty;var R=Object.getOwnPropertyDescriptor;var j=Object.getOwnPropertyNames;var k=Object.getPrototypeOf,P=Object.prototype.hasOwnProperty;var U=(e,u)=>()=>(u||e((u={exports:{}}).exports,u),u.exports);var q=(e,u,t,F)=>{if(u&&typeof u=="object"||typeof u=="function")for(let n of j(u))!P.call(e,n)&&n!==t&&y(e,n,{get:()=>u[n],enumerable:!(F=R(u,n))||F.enumerable});return e};var I=(e,u,t)=>(t=e!=null?M(k(e)):{},q(u||!e||!e.__esModule?y(t,"default",{value:e,enumerable:!0}):t,e));var L=U((tu,T)=>{"use strict";T.exports=W;function g(e){return e instanceof Buffer?Buffer.from(e):new e.constructor(e.buffer.slice(),e.byteOffset,e.length)}function W(e){if(e=e||{},e.circles)return _(e);let u=new Map;if(u.set(Date,l=>new Date(l)),u.set(Map,(l,o)=>new Map(F(Array.from(l),o))),u.set(Set,(l,o)=>new Set(F(Array.from(l),o))),e.constructorHandlers)for(let l of e.constructorHandlers)u.set(l[0],l[1]);let t=null;return e.proto?c:n;function F(l,o){let D=Object.keys(l),r=new Array(D.length);for(let i=0;i<D.length;i++){let s=D[i],a=l[s];typeof a!="object"||a===null?r[s]=a:a.constructor!==Object&&(t=u.get(a.constructor))?r[s]=t(a,o):ArrayBuffer.isView(a)?r[s]=g(a):r[s]=o(a)}return r}function n(l){if(typeof l!="object"||l===null)return l;if(Array.isArray(l))return F(l,n);if(l.constructor!==Object&&(t=u.get(l.constructor)))return t(l,n);let o={};for(let D in l){if(Object.hasOwnProperty.call(l,D)===!1)continue;let r=l[D];typeof r!="object"||r===null?o[D]=r:r.constructor!==Object&&(t=u.get(r.constructor))?o[D]=t(r,n):ArrayBuffer.isView(r)?o[D]=g(r):o[D]=n(r)}return o}function c(l){if(typeof l!="object"||l===null)return l;if(Array.isArray(l))return F(l,c);if(l.constructor!==Object&&(t=u.get(l.constructor)))return t(l,c);let o={};for(let D in l){let r=l[D];typeof r!="object"||r===null?o[D]=r:r.constructor!==Object&&(t=u.get(r.constructor))?o[D]=t(r,c):ArrayBuffer.isView(r)?o[D]=g(r):o[D]=c(r)}return o}}function _(e){let u=[],t=[],F=new Map;if(F.set(Date,D=>new Date(D)),F.set(Map,(D,r)=>new Map(c(Array.from(D),r))),F.set(Set,(D,r)=>new Set(c(Array.from(D),r))),e.constructorHandlers)for(let D of e.constructorHandlers)F.set(D[0],D[1]);let n=null;return e.proto?o:l;function c(D,r){let i=Object.keys(D),s=new Array(i.length);for(let a=0;a<i.length;a++){let f=i[a],E=D[f];if(typeof E!="object"||E===null)s[f]=E;else if(E.constructor!==Object&&(n=F.get(E.constructor)))s[f]=n(E,r);else if(ArrayBuffer.isView(E))s[f]=g(E);else{let d=u.indexOf(E);d!==-1?s[f]=t[d]:s[f]=r(E)}}return s}function l(D){if(typeof D!="object"||D===null)return D;if(Array.isArray(D))return c(D,l);if(D.constructor!==Object&&(n=F.get(D.constructor)))return n(D,l);let r={};u.push(D),t.push(r);for(let i in D){if(Object.hasOwnProperty.call(D,i)===!1)continue;let s=D[i];if(typeof s!="object"||s===null)r[i]=s;else if(s.constructor!==Object&&(n=F.get(s.constructor)))r[i]=n(s,l);else if(ArrayBuffer.isView(s))r[i]=g(s);else{let a=u.indexOf(s);a!==-1?r[i]=t[a]:r[i]=l(s)}}return u.pop(),t.pop(),r}function o(D){if(typeof D!="object"||D===null)return D;if(Array.isArray(D))return c(D,o);if(D.constructor!==Object&&(n=F.get(D.constructor)))return n(D,o);let r={};u.push(D),t.push(r);for(let i in D){let s=D[i];if(typeof s!="object"||s===null)r[i]=s;else if(s.constructor!==Object&&(n=F.get(s.constructor)))r[i]=n(s,o);else if(ArrayBuffer.isView(s))r[i]=g(s);else{let a=u.indexOf(s);a!==-1?r[i]=t[a]:r[i]=o(s)}}return u.pop(),t.pop(),r}}});var uu=Object.hasOwnProperty;var b=I(L(),1),V=(0,b.default)();function S(e){let u=v(J(e,"index"),!0);return u.length===0?"/":u}function z(e){let u=e.split("/").filter(t=>t!=="").slice(0,-1).map(t=>"..").join("/");return u.length===0&&(u="."),u}function x(e,u){return B(z(e),S(u))}function B(...e){if(e.length===0)return"";let u=e.filter(t=>t!==""&&t!=="/").map(t=>v(t)).join("/");return e[0].startsWith("/")&&(u="/"+u),e[e.length-1].endsWith("/")&&(u=u+"/"),u}function $(e,u){return e===u||e.endsWith("/"+u)}function J(e,u){return $(e,u)&&(e=e.slice(0,-u.length)),e}function v(e,u){return e.startsWith("/")&&(e=e.substring(1)),!u&&e.endsWith("/")&&(e=e.slice(0,-1)),e}var m=class e{isFolder;children;slugSegments;fileSegmentHint;displayNameOverride;data;constructor(u,t){this.children=[],this.slugSegments=u,this.data=t??null,this.isFolder=!1,this.displayNameOverride=void 0}get displayName(){let u=this.data?.title==="index"?void 0:this.data?.title;return this.displayNameOverride??u??this.fileSegmentHint??this.slugSegment??""}set displayName(u){this.displayNameOverride=u}get slug(){let u=B(...this.slugSegments);return this.isFolder?B(u,"index"):u}get slugSegment(){return this.slugSegments[this.slugSegments.length-1]}makeChild(u,t){let F=[...this.slugSegments,u[0]],n=new e(F,t);return this.children.push(n),n}insert(u,t){if(u.length===0)throw new Error("path is empty");this.isFolder=!0;let F=u[0];if(u.length===1)F==="index"?this.data??=t:this.makeChild(u,t);else if(u.length>1){let n=this.children.find(l=>l.slugSegment===F)??this.makeChild(u,void 0),c=t.filePath.split("/");n.fileSegmentHint=c.at(-u.length),n.insert(u.slice(1),t)}}add(u){this.insert(u.slug.split("/"),u)}findNode(u){return u.length===0||u.length===1&&u[0]==="index"?this:this.children.find(t=>t.slugSegment===u[0])?.findNode(u.slice(1))}ancestryChain(u){if(u.length===0||u.length===1&&u[0]==="index")return[this];let t=this.children.find(n=>n.slugSegment===u[0]);if(!t)return;let F=t.ancestryChain(u.slice(1));if(F)return[this,...F]}filter(u){this.children=this.children.filter(u),this.children.forEach(t=>t.filter(u))}map(u){u(this),this.children.forEach(t=>t.map(u))}sort(u){this.children=this.children.sort(u),this.children.forEach(t=>t.sort(u))}static fromEntries(u){let t=new e([]);return u.forEach(([,F])=>t.add(F)),t}entries(){let u=t=>[[t.slug,t]].concat(...t.children.map(u));return u(this)}getFolderPaths(){return this.entries().filter(([u,t])=>t.isFolder).map(([u,t])=>u)}};var p;function w(){let e=this.closest(".explorer");if(!e)return;let u=e.classList.toggle("collapsed");e.setAttribute("aria-expanded",e.getAttribute("aria-expanded")==="true"?"false":"true"),u?document.documentElement.classList.remove("mobile-no-scroll"):document.documentElement.classList.add("mobile-no-scroll")}function h(e){e.stopPropagation();let u=e.target;if(!u)return;let F=u.nodeName==="svg"?u.parentElement:u.parentElement?.parentElement;if(!F)return;let n=F.nextElementSibling;if(!n)return;n.classList.toggle("open");let c=!n.classList.contains("open");Q(n,c);let l=p.find(D=>D.path===F.dataset.folderpath);l?l.collapsed=c:p.push({path:F.dataset.folderpath,collapsed:c});let o=JSON.stringify(p);localStorage.setItem("fileTree",o)}function N(e,u){let n=document.getElementById("template-file").content.cloneNode(!0).querySelector("li"),c=n.querySelector("a");return c.href=x(e,u.slug),c.dataset.for=u.slug,c.textContent=u.displayName,e===u.slug&&c.classList.add("active"),n}function H(e,u,t){let c=document.getElementById("template-folder").content.cloneNode(!0).querySelector("li"),l=c.querySelector(".folder-container"),o=l.querySelector("div"),D=c.querySelector(".folder-outer"),r=D.querySelector("ul"),i=u.slug;if(l.dataset.folderpath=i,e===i&&l.classList.add("active"),t.folderClickBehavior==="link"){let E=o.querySelector(".folder-button"),d=document.createElement("a");d.href=x(e,i),d.dataset.for=i,d.className="folder-title",d.textContent=u.displayName,E.replaceWith(d)}else{let E=o.querySelector(".folder-title");E.textContent=u.displayName}let s=p.find(E=>E.path===i)?.collapsed??t.folderDefaultState==="collapsed",a=S(i),f=a===e.slice(0,a.length);(!s||f)&&D.classList.add("open");for(let E of u.children){let d=E.isFolder?H(e,E,t):N(e,E);r.appendChild(d)}return c}async function Z(e){let u=document.querySelectorAll("div.explorer");for(let t of u){let F=JSON.parse(t.dataset.dataFns||"{}"),n={folderClickBehavior:t.dataset.behavior||"collapse",folderDefaultState:t.dataset.collapsed||"collapsed",useSavedState:t.dataset.savestate==="true",order:F.order||["filter","map","sort"],sortFn:new Function("return "+(F.sortFn||"undefined"))(),filterFn:new Function("return "+(F.filterFn||"undefined"))(),mapFn:new Function("return "+(F.mapFn||"undefined"))()},c=localStorage.getItem("fileTree"),l=c&&n.useSavedState?JSON.parse(c):[],o=new Map(l.map(C=>[C.path,C.collapsed])),D=await fetchData,r=[...Object.entries(D)],i=m.fromEntries(r);for(let C of n.order)switch(C){case"filter":n.filterFn&&i.filter(n.filterFn);break;case"map":n.mapFn&&i.map(n.mapFn);break;case"sort":n.sortFn&&i.sort(n.sortFn);break}p=i.getFolderPaths().map(C=>{let A=o.get(C);return{path:C,collapsed:A===void 0?n.folderDefaultState==="collapsed":A}});let a=t.querySelector(".explorer-ul");if(!a)continue;let f=document.createDocumentFragment();for(let C of i.children){let A=C.isFolder?H(e,C,n):N(e,C);f.appendChild(A)}a.insertBefore(f,a.firstChild);let E=sessionStorage.getItem("explorerScrollTop");if(E)a.scrollTop=parseInt(E);else{let C=a.querySelector(".active");C&&C.scrollIntoView({behavior:"smooth"})}let d=t.getElementsByClassName("explorer-toggle");for(let C of d)C.addEventListener("click",w),window.addCleanup(()=>C.removeEventListener("click",w));if(n.folderClickBehavior==="collapse"){let C=t.getElementsByClassName("folder-button");for(let A of C)A.addEventListener("click",h),window.addCleanup(()=>A.removeEventListener("click",h))}let O=t.getElementsByClassName("folder-icon");for(let C of O)C.addEventListener("click",h),window.addCleanup(()=>C.removeEventListener("click",h))}}document.addEventListener("prenav",async()=>{let e=document.querySelector(".explorer-ul");e&&sessionStorage.setItem("explorerScrollTop",e.scrollTop.toString())});document.addEventListener("nav",async e=>{let u=e.detail.url;await Z(u);for(let t of document.getElementsByClassName("explorer")){let F=t.querySelector(".mobile-explorer");if(!F)return;F.checkVisibility()&&(t.classList.add("collapsed"),t.setAttribute("aria-expanded","false"),document.documentElement.classList.remove("mobile-no-scroll")),F.classList.remove("hide-until-loaded")}});window.addEventListener("resize",function(){let e=document.querySelector(".explorer");if(e&&!e.classList.contains("collapsed")){document.documentElement.classList.add("mobile-no-scroll");return}});function Q(e,u){return u?e.classList.remove("open"):e.classList.add("open")}
`;import{jsx as jsx24,jsxs as jsxs14}from"preact/jsx-runtime";var defaultOptions13={folderDefaultState:"collapsed",folderClickBehavior:"link",useSavedState:!0,mapFn:__name(node=>node,"mapFn"),sortFn:__name((a,b)=>!a.isFolder&&!b.isFolder||a.isFolder&&b.isFolder?a.displayName.localeCompare(b.displayName,void 0,{numeric:!0,sensitivity:"base"}):!a.isFolder&&b.isFolder?1:-1,"sortFn"),filterFn:__name(node=>node.slugSegment!=="tags","filterFn"),order:["filter","map","sort"]},numExplorers=0,Explorer_default=__name((userOpts=>{let opts={...defaultOptions13,...userOpts},{OverflowList:OverflowList2,overflowListAfterDOMLoaded}=OverflowList_default(),Explorer=__name(({cfg,displayClass})=>{let id=`explorer-${numExplorers++}`;return jsxs14("div",{class:classNames(displayClass,"explorer"),"data-behavior":opts.folderClickBehavior,"data-collapsed":opts.folderDefaultState,"data-savestate":opts.useSavedState,"data-data-fns":JSON.stringify({order:opts.order,sortFn:opts.sortFn.toString(),filterFn:opts.filterFn.toString(),mapFn:opts.mapFn.toString()}),children:[jsx24("button",{type:"button",class:"explorer-toggle mobile-explorer hide-until-loaded","data-mobile":!0,"aria-controls":id,children:jsxs14("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"lucide-menu",children:[jsx24("line",{x1:"4",x2:"20",y1:"12",y2:"12"}),jsx24("line",{x1:"4",x2:"20",y1:"6",y2:"6"}),jsx24("line",{x1:"4",x2:"20",y1:"18",y2:"18"})]})}),jsxs14("button",{type:"button",class:"title-button explorer-toggle desktop-explorer","data-mobile":!1,"aria-expanded":!0,children:[jsx24("h2",{children:opts.title??i18n(cfg.locale).components.explorer.title}),jsx24("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"5 8 14 8",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"fold",children:jsx24("polyline",{points:"6 9 12 15 18 9"})})]}),jsx24("div",{id,class:"explorer-content","aria-expanded":!1,role:"group",children:jsx24(OverflowList2,{class:"explorer-ul"})}),jsx24("template",{id:"template-file",children:jsx24("li",{children:jsx24("a",{href:"#"})})}),jsx24("template",{id:"template-folder",children:jsxs14("li",{children:[jsxs14("div",{class:"folder-container",children:[jsx24("svg",{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"12",viewBox:"5 8 14 8",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"folder-icon",children:jsx24("polyline",{points:"6 9 12 15 18 9"})}),jsx24("div",{children:jsx24("button",{class:"folder-button",children:jsx24("span",{class:"folder-title"})})})]}),jsx24("div",{class:"folder-outer",children:jsx24("ul",{class:"content"})})]})})]})},"Explorer");return Explorer.css=explorer_default,Explorer.afterDOMLoaded=concatenateResources(explorer_inline_default,overflowListAfterDOMLoaded),Explorer}),"default");import{jsx as jsx25}from"preact/jsx-runtime";var TagList=__name(({fileData,displayClass})=>{let tags=fileData.frontmatter?.tags;return tags&&tags.length>0?jsx25("ul",{class:classNames(displayClass,"tags"),children:tags.map(tag=>{let linkDest=resolveRelative(fileData.slug,`tags/${tag}`);return jsx25("li",{children:jsx25("a",{href:linkDest,class:"internal tag-link",children:tag})})})}):null},"TagList");TagList.css=`
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.section-li > .section > .tags {
  justify-content: flex-end;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`;var TagList_default=__name((()=>TagList),"default");import{jsx as jsx26,jsxs as jsxs15}from"preact/jsx-runtime";import{jsx as jsx27,jsxs as jsxs16}from"preact/jsx-runtime";var search_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
.search {
  min-width: fit-content;
  max-width: 14rem;
}
@media all and ((max-width: 800px)) {
  .search {
    flex-grow: 0.3;
  }
}
.search > .search-button {
  background-color: transparent;
  border: 1px var(--lightgray) solid;
  border-radius: 4px;
  font-family: inherit;
  font-size: inherit;
  height: 2rem;
  padding: 0 1rem 0 0;
  display: flex;
  align-items: center;
  text-align: inherit;
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
}
.search > .search-button > p {
  display: inline;
  color: var(--gray);
  text-wrap: unset;
}
.search > .search-button svg {
  cursor: pointer;
  width: 18px;
  min-width: 18px;
  margin: 0 0.5rem;
}
.search > .search-button svg .search-path {
  stroke: var(--darkgray);
  stroke-width: 1.5px;
  transition: stroke 0.5s ease;
}
.search > .search-container {
  position: fixed;
  contain: layout;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  display: none;
  backdrop-filter: blur(4px);
}
.search > .search-container.active {
  display: inline-block;
}
.search > .search-container > .search-space {
  width: 65%;
  margin-top: 12vh;
  margin-left: auto;
  margin-right: auto;
}
@media all and not ((min-width: 1200px)) {
  .search > .search-container > .search-space {
    width: 90%;
  }
}
.search > .search-container > .search-space > * {
  width: 100%;
  border-radius: 7px;
  background: var(--light);
  box-shadow: 0 14px 50px rgba(27, 33, 48, 0.12), 0 10px 30px rgba(27, 33, 48, 0.16);
  margin-bottom: 2em;
}
.search > .search-container > .search-space > input {
  box-sizing: border-box;
  padding: 0.5em 1em;
  font-family: var(--bodyFont);
  color: var(--dark);
  font-size: 1.1em;
  border: 1px solid var(--lightgray);
}
.search > .search-container > .search-space > input:focus {
  outline: none;
}
.search > .search-container > .search-space > .search-layout {
  display: none;
  flex-direction: row;
  border: 1px solid var(--lightgray);
  flex: 0 0 100%;
  box-sizing: border-box;
}
.search > .search-container > .search-space > .search-layout.display-results {
  display: flex;
}
.search > .search-container > .search-space > .search-layout[data-preview] > .results-container {
  flex: 0 0 min(30%, 450px);
}
@media all and not ((max-width: 800px)) {
  .search > .search-container > .search-space > .search-layout[data-preview] .result-card > p.preview {
    display: none;
  }
  .search > .search-container > .search-space > .search-layout[data-preview] > div:first-child {
    border-right: 1px solid var(--lightgray);
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
  }
  .search > .search-container > .search-space > .search-layout[data-preview] > div:last-child {
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
  }
}
.search > .search-container > .search-space > .search-layout > div {
  height: 63vh;
  border-radius: 5px;
}
@media all and ((max-width: 800px)) {
  .search > .search-container > .search-space > .search-layout {
    flex-direction: column;
  }
  .search > .search-container > .search-space > .search-layout > .preview-container {
    display: none !important;
  }
  .search > .search-container > .search-space > .search-layout[data-preview] > .results-container {
    width: 100%;
    height: auto;
    flex: 0 0 100%;
  }
}
.search > .search-container > .search-space > .search-layout .highlight {
  background: color-mix(in srgb, var(--tertiary) 60%, rgba(255, 255, 255, 0));
  border-radius: 5px;
  scroll-margin-top: 2rem;
}
.search > .search-container > .search-space > .search-layout > .preview-container {
  flex-grow: 1;
  display: block;
  overflow: hidden;
  font-family: inherit;
  color: var(--dark);
  line-height: 1.5em;
  font-weight: 400;
  overflow-y: auto;
  padding: 0 2rem;
}
.search > .search-container > .search-space > .search-layout > .preview-container .preview-inner {
  margin: 0 auto;
  width: min(800px, 100%);
}
.search > .search-container > .search-space > .search-layout > .preview-container a[role=anchor] {
  background-color: transparent;
}
.search > .search-container > .search-space > .search-layout > .results-container {
  overflow-y: auto;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card {
  overflow: hidden;
  padding: 1em;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid var(--lightgray);
  width: 100%;
  display: block;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  text-transform: none;
  text-align: left;
  outline: none;
  font-weight: inherit;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card:hover, .search > .search-container > .search-space > .search-layout > .results-container .result-card:focus, .search > .search-container > .search-space > .search-layout > .results-container .result-card.focus {
  background: var(--lightgray);
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > h3 {
  margin: 0;
}
@media all and not ((max-width: 800px)) {
  .search > .search-container > .search-space > .search-layout > .results-container .result-card > p.card-description {
    display: none;
  }
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > ul.tags {
  margin-top: 0.45rem;
  margin-bottom: 0;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > ul > li > p {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
  line-height: 1.4rem;
  font-weight: 700;
  color: var(--secondary);
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > ul > li > p.match-tag {
  color: var(--tertiary);
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > p {
  margin-bottom: 0;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2NzcyIsInNlYXJjaC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FDQUE7RUFDRTtFQUNBOztBQUNBO0VBSEY7SUFJSTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBOztBQUtOO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBTkY7SUFPSTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQSxZQUNFO0VBRUY7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFOztBQUdGO0VBRUk7SUFDRTs7RUFJQTtJQUNFO0lBQ0E7SUFDQTs7RUFHRjtJQUNFO0lBQ0E7OztBQU1SO0VBQ0U7RUFDQTs7QUFHRjtFQXpDRjtJQTBDSTs7RUFFQTtJQUNFOztFQUdGO0lBQ0U7SUFDQTtJQUNBOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLGFEMUlLO0VDMklMO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBQ0U7O0FBSUo7RUFDRTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFHQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBR0U7O0FBR0Y7RUFDRTs7QUFHRjtFQUNFO0lBQ0U7OztBQUlKO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxhRDVNRDtFQzZNQzs7QUFFQTtFQUNFOztBQUlKO0VBQ0UiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwic2FzczptYXBcIjtcblxuLyoqXG4gKiBMYXlvdXQgYnJlYWtwb2ludHNcbiAqICRtb2JpbGU6IHNjcmVlbiB3aWR0aCBiZWxvdyB0aGlzIHZhbHVlIHdpbGwgdXNlIG1vYmlsZSBzdHlsZXNcbiAqICRkZXNrdG9wOiBzY3JlZW4gd2lkdGggYWJvdmUgdGhpcyB2YWx1ZSB3aWxsIHVzZSBkZXNrdG9wIHN0eWxlc1xuICogU2NyZWVuIHdpZHRoIGJldHdlZW4gJG1vYmlsZSBhbmQgJGRlc2t0b3Agd2lkdGggd2lsbCB1c2UgdGhlIHRhYmxldCBsYXlvdXQuXG4gKiBhc3N1bWluZyBtb2JpbGUgPCBkZXNrdG9wXG4gKi9cbiRicmVha3BvaW50czogKFxuICBtb2JpbGU6IDgwMHB4LFxuICBkZXNrdG9wOiAxMjAwcHgsXG4pO1xuXG4kbW9iaWxlOiBcIihtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9KVwiO1xuJHRhYmxldDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSkgYW5kIChtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcbiRkZXNrdG9wOiBcIihtaW4td2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcblxuJHBhZ2VXaWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX07XG4kc2lkZVBhbmVsV2lkdGg6IDMyMHB4OyAvLzM4MHB4O1xuJHRvcFNwYWNpbmc6IDZyZW07XG4kYm9sZFdlaWdodDogNzAwO1xuJHNlbWlCb2xkV2VpZ2h0OiA2MDA7XG4kbm9ybWFsV2VpZ2h0OiA0MDA7XG5cbiRtb2JpbGVHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcImF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnRcIlxcXG4gICAgICBcImdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLWZvb3RlclwiJyxcbik7XG4kdGFibGV0R3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiI3skc2lkZVBhbmVsV2lkdGh9IGF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyXCInLFxuKTtcbiRkZXNrdG9wR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvICN7JHNpZGVQYW5lbFdpZHRofVwiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWhlYWRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyIGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1mb290ZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCInLFxuKTtcbiIsIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuXG4uc2VhcmNoIHtcbiAgbWluLXdpZHRoOiBmaXQtY29udGVudDtcbiAgbWF4LXdpZHRoOiAxNHJlbTtcbiAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICBmbGV4LWdyb3c6IDAuMztcbiAgfVxuXG4gICYgPiAuc2VhcmNoLWJ1dHRvbiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyOiAxcHggdmFyKC0tbGlnaHRncmF5KSBzb2xpZDtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gICAgZm9udC1zaXplOiBpbmhlcml0O1xuICAgIGhlaWdodDogMnJlbTtcbiAgICBwYWRkaW5nOiAwIDFyZW0gMCAwO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB0ZXh0LWFsaWduOiBpbmhlcml0O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgJiA+IHAge1xuICAgICAgZGlzcGxheTogaW5saW5lO1xuICAgICAgY29sb3I6IHZhcigtLWdyYXkpO1xuICAgICAgdGV4dC13cmFwOiB1bnNldDtcbiAgICB9XG5cbiAgICAmIHN2ZyB7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICB3aWR0aDogMThweDtcbiAgICAgIG1pbi13aWR0aDogMThweDtcbiAgICAgIG1hcmdpbjogMCAwLjVyZW07XG5cbiAgICAgIC5zZWFyY2gtcGF0aCB7XG4gICAgICAgIHN0cm9rZTogdmFyKC0tZGFya2dyYXkpO1xuICAgICAgICBzdHJva2Utd2lkdGg6IDEuNXB4O1xuICAgICAgICB0cmFuc2l0aW9uOiBzdHJva2UgMC41cyBlYXNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICYgPiAuc2VhcmNoLWNvbnRhaW5lciB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGNvbnRhaW46IGxheW91dDtcbiAgICB6LWluZGV4OiA5OTk7XG4gICAgbGVmdDogMDtcbiAgICB0b3A6IDA7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xuXG4gICAgJi5hY3RpdmUge1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIH1cblxuICAgICYgPiAuc2VhcmNoLXNwYWNlIHtcbiAgICAgIHdpZHRoOiA2NSU7XG4gICAgICBtYXJnaW4tdG9wOiAxMnZoO1xuICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG5cbiAgICAgIEBtZWRpYSBhbGwgYW5kIG5vdCAoJGRlc2t0b3ApIHtcbiAgICAgICAgd2lkdGg6IDkwJTtcbiAgICAgIH1cblxuICAgICAgJiA+ICoge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogN3B4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodCk7XG4gICAgICAgIGJveC1zaGFkb3c6XG4gICAgICAgICAgMCAxNHB4IDUwcHggcmdiYSgyNywgMzMsIDQ4LCAwLjEyKSxcbiAgICAgICAgICAwIDEwcHggMzBweCByZ2JhKDI3LCAzMywgNDgsIDAuMTYpO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAyZW07XG4gICAgICB9XG5cbiAgICAgICYgPiBpbnB1dCB7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIHBhZGRpbmc6IDAuNWVtIDFlbTtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcigtLWJvZHlGb250KTtcbiAgICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgICAgICBmb250LXNpemU6IDEuMWVtO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuXG4gICAgICAgICY6Zm9jdXMge1xuICAgICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJiA+IC5zZWFyY2gtbGF5b3V0IHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgICAgZmxleDogMCAwIDEwMCU7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgICAgICAgJi5kaXNwbGF5LXJlc3VsdHMge1xuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIH1cblxuICAgICAgICAmW2RhdGEtcHJldmlld10gPiAucmVzdWx0cy1jb250YWluZXIge1xuICAgICAgICAgIGZsZXg6IDAgMCBtaW4oMzAlLCA0NTBweCk7XG4gICAgICAgIH1cblxuICAgICAgICBAbWVkaWEgYWxsIGFuZCBub3QgKCRtb2JpbGUpIHtcbiAgICAgICAgICAmW2RhdGEtcHJldmlld10ge1xuICAgICAgICAgICAgJiAucmVzdWx0LWNhcmQgPiBwLnByZXZpZXcge1xuICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmID4gZGl2IHtcbiAgICAgICAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICAgICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgICAgICAgICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogdW5zZXQ7XG4gICAgICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IHVuc2V0O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgICAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiB1bnNldDtcbiAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiB1bnNldDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICYgPiBkaXYge1xuICAgICAgICAgIGhlaWdodDogY2FsYyg3NXZoIC0gMTJ2aCk7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICAgICAgICAgJiA+IC5wcmV2aWV3LWNvbnRhaW5lciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJltkYXRhLXByZXZpZXddID4gLnJlc3VsdHMtY29udGFpbmVyIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiBhdXRvO1xuICAgICAgICAgICAgZmxleDogMCAwIDEwMCU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJiAuaGlnaGxpZ2h0IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tdGVydGlhcnkpIDYwJSwgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKSk7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgICAgIHNjcm9sbC1tYXJnaW4tdG9wOiAycmVtO1xuICAgICAgICB9XG5cbiAgICAgICAgJiA+IC5wcmV2aWV3LWNvbnRhaW5lciB7XG4gICAgICAgICAgZmxleC1ncm93OiAxO1xuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gICAgICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjVlbTtcbiAgICAgICAgICBmb250LXdlaWdodDogJG5vcm1hbFdlaWdodDtcbiAgICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgICAgIHBhZGRpbmc6IDAgMnJlbTtcblxuICAgICAgICAgICYgLnByZXZpZXctaW5uZXIge1xuICAgICAgICAgICAgbWFyZ2luOiAwIGF1dG87XG4gICAgICAgICAgICB3aWR0aDogbWluKCRwYWdlV2lkdGgsIDEwMCUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFbcm9sZT1cImFuY2hvclwiXSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmID4gLnJlc3VsdHMtY29udGFpbmVyIHtcbiAgICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuXG4gICAgICAgICAgJiAucmVzdWx0LWNhcmQge1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIHBhZGRpbmc6IDFlbTtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4ycyBlYXNlO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcblxuICAgICAgICAgICAgLy8gbm9ybWFsaXplIGNhcmQgcHJvcHNcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMDAlO1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTU7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XG5cbiAgICAgICAgICAgICY6aG92ZXIsXG4gICAgICAgICAgICAmOmZvY3VzLFxuICAgICAgICAgICAgJi5mb2N1cyB7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYgPiBoMyB7XG4gICAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgQG1lZGlhIGFsbCBhbmQgbm90ICgkbW9iaWxlKSB7XG4gICAgICAgICAgICAgICYgPiBwLmNhcmQtZGVzY3JpcHRpb24ge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJiA+IHVsLnRhZ3Mge1xuICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAwLjQ1cmVtO1xuICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmID4gdWwgPiBsaSA+IHAge1xuICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhpZ2hsaWdodCk7XG4gICAgICAgICAgICAgIHBhZGRpbmc6IDAuMnJlbSAwLjRyZW07XG4gICAgICAgICAgICAgIG1hcmdpbjogMCAwLjFyZW07XG4gICAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjRyZW07XG4gICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiAkYm9sZFdlaWdodDtcbiAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG5cbiAgICAgICAgICAgICAgJi5tYXRjaC10YWcge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXJ0aWFyeSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJiA+IHAge1xuICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19 */`;var search_inline_default=`var Me=Object.create;var Qt=Object.defineProperty;var je=Object.getOwnPropertyDescriptor;var Te=Object.getOwnPropertyNames;var Re=Object.getPrototypeOf,He=Object.prototype.hasOwnProperty;var Xt=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var Oe=(t,e,n,u)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Te(e))!He.call(t,i)&&i!==n&&Qt(t,i,{get:()=>e[i],enumerable:!(u=je(e,i))||u.enumerable});return t};var Yt=(t,e,n)=>(n=t!=null?Me(Re(t)):{},Oe(e||!t||!t.__esModule?Qt(n,"default",{value:t,enumerable:!0}):n,t));var Rt=Xt(()=>{});var ye=Xt((Bn,Ae)=>{"use strict";Ae.exports=tn;function ot(t){return t instanceof Buffer?Buffer.from(t):new t.constructor(t.buffer.slice(),t.byteOffset,t.length)}function tn(t){if(t=t||{},t.circles)return en(t);let e=new Map;if(e.set(Date,r=>new Date(r)),e.set(Map,(r,o)=>new Map(u(Array.from(r),o))),e.set(Set,(r,o)=>new Set(u(Array.from(r),o))),t.constructorHandlers)for(let r of t.constructorHandlers)e.set(r[0],r[1]);let n=null;return t.proto?s:i;function u(r,o){let l=Object.keys(r),h=new Array(l.length);for(let c=0;c<l.length;c++){let f=l[c],p=r[f];typeof p!="object"||p===null?h[f]=p:p.constructor!==Object&&(n=e.get(p.constructor))?h[f]=n(p,o):ArrayBuffer.isView(p)?h[f]=ot(p):h[f]=o(p)}return h}function i(r){if(typeof r!="object"||r===null)return r;if(Array.isArray(r))return u(r,i);if(r.constructor!==Object&&(n=e.get(r.constructor)))return n(r,i);let o={};for(let l in r){if(Object.hasOwnProperty.call(r,l)===!1)continue;let h=r[l];typeof h!="object"||h===null?o[l]=h:h.constructor!==Object&&(n=e.get(h.constructor))?o[l]=n(h,i):ArrayBuffer.isView(h)?o[l]=ot(h):o[l]=i(h)}return o}function s(r){if(typeof r!="object"||r===null)return r;if(Array.isArray(r))return u(r,s);if(r.constructor!==Object&&(n=e.get(r.constructor)))return n(r,s);let o={};for(let l in r){let h=r[l];typeof h!="object"||h===null?o[l]=h:h.constructor!==Object&&(n=e.get(h.constructor))?o[l]=n(h,s):ArrayBuffer.isView(h)?o[l]=ot(h):o[l]=s(h)}return o}}function en(t){let e=[],n=[],u=new Map;if(u.set(Date,l=>new Date(l)),u.set(Map,(l,h)=>new Map(s(Array.from(l),h))),u.set(Set,(l,h)=>new Set(s(Array.from(l),h))),t.constructorHandlers)for(let l of t.constructorHandlers)u.set(l[0],l[1]);let i=null;return t.proto?o:r;function s(l,h){let c=Object.keys(l),f=new Array(c.length);for(let p=0;p<c.length;p++){let a=c[p],d=l[a];if(typeof d!="object"||d===null)f[a]=d;else if(d.constructor!==Object&&(i=u.get(d.constructor)))f[a]=i(d,h);else if(ArrayBuffer.isView(d))f[a]=ot(d);else{let D=e.indexOf(d);D!==-1?f[a]=n[D]:f[a]=h(d)}}return f}function r(l){if(typeof l!="object"||l===null)return l;if(Array.isArray(l))return s(l,r);if(l.constructor!==Object&&(i=u.get(l.constructor)))return i(l,r);let h={};e.push(l),n.push(h);for(let c in l){if(Object.hasOwnProperty.call(l,c)===!1)continue;let f=l[c];if(typeof f!="object"||f===null)h[c]=f;else if(f.constructor!==Object&&(i=u.get(f.constructor)))h[c]=i(f,r);else if(ArrayBuffer.isView(f))h[c]=ot(f);else{let p=e.indexOf(f);p!==-1?h[c]=n[p]:h[c]=r(f)}}return e.pop(),n.pop(),h}function o(l){if(typeof l!="object"||l===null)return l;if(Array.isArray(l))return s(l,o);if(l.constructor!==Object&&(i=u.get(l.constructor)))return i(l,o);let h={};e.push(l),n.push(h);for(let c in l){let f=l[c];if(typeof f!="object"||f===null)h[c]=f;else if(f.constructor!==Object&&(i=u.get(f.constructor)))h[c]=i(f,o);else if(ArrayBuffer.isView(f))h[c]=ot(f);else{let p=e.indexOf(f);p!==-1?h[c]=n[p]:h[c]=o(f)}}return e.pop(),n.pop(),h}}});var C;function _(t,e,n){let u=typeof n,i=typeof t;if(u!=="undefined"){if(i!=="undefined"){if(n){if(i==="function"&&u===i)return function(o){return t(n(o))};if(e=t.constructor,e===n.constructor){if(e===Array)return n.concat(t);if(e===Map){var s=new Map(n);for(var r of t)s.set(r[0],r[1]);return s}if(e===Set){r=new Set(n);for(s of t.values())r.add(s);return r}}}return t}return n}return i==="undefined"?e:t}function nt(t,e){return typeof t>"u"?e:t}function O(){return Object.create(null)}function N(t){return typeof t=="string"}function at(t){return typeof t=="object"}function Dt(t,e){if(N(e))t=t[e];else for(let n=0;t&&n<e.length;n++)t=t[e[n]];return t}var Ie=/[^\\p{L}\\p{N}]+/u,ze=/(\\d{3})/g,_e=/(\\D)(\\d{3})/g,Pe=/(\\d{3})(\\D)/g,Gt=/[\\u0300-\\u036f]/g;function rt(t={}){if(!this||this.constructor!==rt)return new rt(...arguments);if(arguments.length)for(t=0;t<arguments.length;t++)this.assign(arguments[t]);else this.assign(t)}C=rt.prototype;C.assign=function(t){this.normalize=_(t.normalize,!0,this.normalize);let e=t.include,n=e||t.exclude||t.split,u;if(n||n===""){if(typeof n=="object"&&n.constructor!==RegExp){let i="";u=!e,e||(i+="\\\\p{Z}"),n.letter&&(i+="\\\\p{L}"),n.number&&(i+="\\\\p{N}",u=!!e),n.symbol&&(i+="\\\\p{S}"),n.punctuation&&(i+="\\\\p{P}"),n.control&&(i+="\\\\p{C}"),(n=n.char)&&(i+=typeof n=="object"?n.join(""):n);try{this.split=new RegExp("["+(e?"^":"")+i+"]+","u")}catch{this.split=/\\s+/}}else this.split=n,u=n===!1||"a1a".split(n).length<2;this.numeric=_(t.numeric,u)}else{try{this.split=_(this.split,Ie)}catch{this.split=/\\s+/}this.numeric=_(t.numeric,_(this.numeric,!0))}if(this.prepare=_(t.prepare,null,this.prepare),this.finalize=_(t.finalize,null,this.finalize),n=t.filter,this.filter=typeof n=="function"?n:_(n&&new Set(n),null,this.filter),this.dedupe=_(t.dedupe,!0,this.dedupe),this.matcher=_((n=t.matcher)&&new Map(n),null,this.matcher),this.mapper=_((n=t.mapper)&&new Map(n),null,this.mapper),this.stemmer=_((n=t.stemmer)&&new Map(n),null,this.stemmer),this.replacer=_(t.replacer,null,this.replacer),this.minlength=_(t.minlength,1,this.minlength),this.maxlength=_(t.maxlength,1024,this.maxlength),this.rtl=_(t.rtl,!1,this.rtl),(this.cache=n=_(t.cache,!0,this.cache))&&(this.F=null,this.L=typeof n=="number"?n:2e5,this.B=new Map,this.D=new Map,this.I=this.H=128),this.h="",this.J=null,this.A="",this.K=null,this.matcher)for(let i of this.matcher.keys())this.h+=(this.h?"|":"")+i;if(this.stemmer)for(let i of this.stemmer.keys())this.A+=(this.A?"|":"")+i;return this};C.addStemmer=function(t,e){return this.stemmer||(this.stemmer=new Map),this.stemmer.set(t,e),this.A+=(this.A?"|":"")+t,this.K=null,this.cache&&G(this),this};C.addFilter=function(t){return typeof t=="function"?this.filter=t:(this.filter||(this.filter=new Set),this.filter.add(t)),this.cache&&G(this),this};C.addMapper=function(t,e){return typeof t=="object"?this.addReplacer(t,e):t.length>1?this.addMatcher(t,e):(this.mapper||(this.mapper=new Map),this.mapper.set(t,e),this.cache&&G(this),this)};C.addMatcher=function(t,e){return typeof t=="object"?this.addReplacer(t,e):t.length<2&&(this.dedupe||this.mapper)?this.addMapper(t,e):(this.matcher||(this.matcher=new Map),this.matcher.set(t,e),this.h+=(this.h?"|":"")+t,this.J=null,this.cache&&G(this),this)};C.addReplacer=function(t,e){return typeof t=="string"?this.addMatcher(t,e):(this.replacer||(this.replacer=[]),this.replacer.push(t,e),this.cache&&G(this),this)};C.encode=function(t,e){if(this.cache&&t.length<=this.H)if(this.F){if(this.B.has(t))return this.B.get(t)}else this.F=setTimeout(G,50,this);this.normalize&&(typeof this.normalize=="function"?t=this.normalize(t):t=Gt?t.normalize("NFKD").replace(Gt,"").toLowerCase():t.toLowerCase()),this.prepare&&(t=this.prepare(t)),this.numeric&&t.length>3&&(t=t.replace(_e,"$1 $2").replace(Pe,"$1 $2").replace(ze,"$1 "));let n=!(this.dedupe||this.mapper||this.filter||this.matcher||this.stemmer||this.replacer),u=[],i=O(),s,r,o=this.split||this.split===""?t.split(this.split):[t];for(let h=0,c,f;h<o.length;h++)if((c=f=o[h])&&!(c.length<this.minlength||c.length>this.maxlength)){if(e){if(i[c])continue;i[c]=1}else{if(s===c)continue;s=c}if(n)u.push(c);else if(!this.filter||(typeof this.filter=="function"?this.filter(c):!this.filter.has(c))){if(this.cache&&c.length<=this.I)if(this.F){var l=this.D.get(c);if(l||l===""){l&&u.push(l);continue}}else this.F=setTimeout(G,50,this);if(this.stemmer){this.K||(this.K=new RegExp("(?!^)("+this.A+")$"));let p;for(;p!==c&&c.length>2;)p=c,c=c.replace(this.K,a=>this.stemmer.get(a))}if(c&&(this.mapper||this.dedupe&&c.length>1)){l="";for(let p=0,a="",d,D;p<c.length;p++)d=c.charAt(p),d===a&&this.dedupe||((D=this.mapper&&this.mapper.get(d))||D===""?D===a&&this.dedupe||!(a=D)||(l+=D):l+=a=d);c=l}if(this.matcher&&c.length>1&&(this.J||(this.J=new RegExp("("+this.h+")","g")),c=c.replace(this.J,p=>this.matcher.get(p))),c&&this.replacer)for(l=0;c&&l<this.replacer.length;l+=2)c=c.replace(this.replacer[l],this.replacer[l+1]);if(this.cache&&f.length<=this.I&&(this.D.set(f,c),this.D.size>this.L&&(this.D.clear(),this.I=this.I/1.1|0)),c){if(c!==f)if(e){if(i[c])continue;i[c]=1}else{if(r===c)continue;r=c}u.push(c)}}}return this.finalize&&(u=this.finalize(u)||u),this.cache&&t.length<=this.H&&(this.B.set(t,u),this.B.size>this.L&&(this.B.clear(),this.H=this.H/1.1|0)),u};function G(t){t.F=null,t.B.clear(),t.D.clear()}function $t(t,e,n){n||(e||typeof t!="object"?typeof e=="object"&&(n=e,e=0):n=t),n&&(t=n.query||t,e=n.limit||e);let u=""+(e||0);n&&(u+=(n.offset||0)+!!n.context+!!n.suggest+(n.resolve!==!1)+(n.resolution||this.resolution)+(n.boost||0)),t=(""+t).toLowerCase(),this.cache||(this.cache=new et);let i=this.cache.get(t+u);if(!i){let s=n&&n.cache;s&&(n.cache=!1),i=this.search(t,e,n),s&&(n.cache=s),this.cache.set(t+u,i)}return i}function et(t){this.limit=t&&t!==!0?t:1e3,this.cache=new Map,this.h=""}et.prototype.set=function(t,e){this.cache.set(this.h=t,e),this.cache.size>this.limit&&this.cache.delete(this.cache.keys().next().value)};et.prototype.get=function(t){let e=this.cache.get(t);return e&&this.h!==t&&(this.cache.delete(t),this.cache.set(this.h=t,e)),e};et.prototype.remove=function(t){for(let e of this.cache){let n=e[0];e[1].includes(t)&&this.cache.delete(n)}};et.prototype.clear=function(){this.cache.clear(),this.h=""};var qt={normalize:!1,numeric:!1,dedupe:!1},Ct={},Ht=new Map([["b","p"],["v","f"],["w","f"],["z","s"],["x","s"],["d","t"],["n","m"],["c","k"],["g","k"],["j","k"],["q","k"],["i","e"],["y","e"],["u","o"]]),te=new Map([["ae","a"],["oe","o"],["sh","s"],["kh","k"],["th","t"],["ph","f"],["pf","f"]]),ee=[/([^aeo])h(.)/g,"$1$2",/([aeo])h([^aeo]|$)/g,"$1$2",/(.)\\1+/g,"$1"],ne={a:"",e:"",i:"",o:"",u:"",y:"",b:1,f:1,p:1,v:1,c:2,g:2,j:2,k:2,q:2,s:2,x:2,z:2,\\u00DF:2,d:3,t:3,l:4,m:5,n:5,r:6},Nt={Exact:qt,Default:Ct,Normalize:Ct,LatinBalance:{mapper:Ht},LatinAdvanced:{mapper:Ht,matcher:te,replacer:ee},LatinExtra:{mapper:Ht,replacer:ee.concat([/(?!^)[aeo]/g,""]),matcher:te},LatinSoundex:{dedupe:!1,include:{letter:!0},finalize:function(t){for(let n=0;n<t.length;n++){var e=t[n];let u=e.charAt(0),i=ne[u];for(let s=1,r;s<e.length&&(r=e.charAt(s),r==="h"||r==="w"||!(r=ne[r])||r===i||(u+=r,i=r,u.length!==4));s++);t[n]=u}}},CJK:{split:""},LatinExact:qt,LatinDefault:Ct,LatinSimple:Ct};function ie(t,e,n,u){let i=[];for(let s=0,r;s<t.index.length;s++)if(r=t.index[s],e>=r.length)e-=r.length;else{e=r[u?"splice":"slice"](e,n);let o=e.length;if(o&&(i=i.length?i.concat(e):e,n-=o,u&&(t.length-=o),!n))break;e=0}return i}function lt(t){if(!this||this.constructor!==lt)return new lt(t);this.index=t?[t]:[],this.length=t?t.length:0;let e=this;return new Proxy([],{get(n,u){if(u==="length")return e.length;if(u==="push")return function(i){e.index[e.index.length-1].push(i),e.length++};if(u==="pop")return function(){if(e.length)return e.length--,e.index[e.index.length-1].pop()};if(u==="indexOf")return function(i){let s=0;for(let r=0,o,l;r<e.index.length;r++){if(o=e.index[r],l=o.indexOf(i),l>=0)return s+l;s+=o.length}return-1};if(u==="includes")return function(i){for(let s=0;s<e.index.length;s++)if(e.index[s].includes(i))return!0;return!1};if(u==="slice")return function(i,s){return ie(e,i||0,s||e.length,!1)};if(u==="splice")return function(i,s){return ie(e,i||0,s||e.length,!0)};if(u==="constructor")return Array;if(typeof u!="symbol")return(n=e.index[u/2**31|0])&&n[u]},set(n,u,i){return n=u/2**31|0,(e.index[n]||(e.index[n]=[]))[u]=i,e.length++,!0}})}lt.prototype.clear=function(){this.index.length=0};lt.prototype.push=function(){};function W(t=8){if(!this||this.constructor!==W)return new W(t);this.index=O(),this.h=[],this.size=0,t>32?(this.B=fe,this.A=BigInt(t)):(this.B=ce,this.A=t)}W.prototype.get=function(t){let e=this.index[this.B(t)];return e&&e.get(t)};W.prototype.set=function(t,e){var n=this.B(t);let u=this.index[n];u?(n=u.size,u.set(t,e),(n-=u.size)&&this.size++):(this.index[n]=u=new Map([[t,e]]),this.h.push(u),this.size++)};function K(t=8){if(!this||this.constructor!==K)return new K(t);this.index=O(),this.h=[],this.size=0,t>32?(this.B=fe,this.A=BigInt(t)):(this.B=ce,this.A=t)}K.prototype.add=function(t){var e=this.B(t);let n=this.index[e];n?(e=n.size,n.add(t),(e-=n.size)&&this.size++):(this.index[e]=n=new Set([t]),this.h.push(n),this.size++)};C=W.prototype;C.has=K.prototype.has=function(t){let e=this.index[this.B(t)];return e&&e.has(t)};C.delete=K.prototype.delete=function(t){let e=this.index[this.B(t)];e&&e.delete(t)&&this.size--};C.clear=K.prototype.clear=function(){this.index=O(),this.h=[],this.size=0};C.values=K.prototype.values=function*(){for(let t=0;t<this.h.length;t++)for(let e of this.h[t].values())yield e};C.keys=K.prototype.keys=function*(){for(let t=0;t<this.h.length;t++)for(let e of this.h[t].keys())yield e};C.entries=K.prototype.entries=function*(){for(let t=0;t<this.h.length;t++)for(let e of this.h[t].entries())yield e};function ce(t){let e=2**this.A-1;if(typeof t=="number")return t&e;let n=0,u=this.A+1;for(let i=0;i<t.length;i++)n=(n*u^t.charCodeAt(i))&e;return this.A===32?n+2**31:n}function fe(t){let e=BigInt(2)**this.A-BigInt(1);var n=typeof t;if(n==="bigint")return t&e;if(n==="number")return BigInt(t)&e;n=BigInt(0);let u=this.A+BigInt(1);for(let i=0;i<t.length;i++)n=(n*u^BigInt(t.charCodeAt(i)))&e;return n}var it,ft;async function $e(t){t=t.data;var e=t.task;let n=t.id,u=t.args;if(e==="init")ft=t.options||{},(e=t.factory)?(Function("return "+e)()(self),it=new self.FlexSearch.Index(ft),delete self.FlexSearch):it=new U(ft),postMessage({id:n});else{let i;e==="export"&&(u[1]?(u[0]=ft.export,u[2]=0,u[3]=1):u=null),e==="import"?u[0]&&(t=await ft.import.call(it,u[0]),it.import(u[0],t)):((i=u&&it[e].apply(it,u))&&i.then&&(i=await i),i&&i.await&&(i=await i.await),e==="search"&&i.result&&(i=i.result)),postMessage(e==="search"?{id:n,msg:i}:{id:n})}}function Wt(t){ut.call(t,"add"),ut.call(t,"append"),ut.call(t,"search"),ut.call(t,"update"),ut.call(t,"remove"),ut.call(t,"searchCache")}var It,ue,wt;function Ne(){It=wt=0}function ut(t){this[t+"Async"]=function(){let e=arguments;var n=e[e.length-1];let u;if(typeof n=="function"&&(u=n,delete e[e.length-1]),It?wt||(wt=Date.now()-ue>=this.priority*this.priority*3):(It=setTimeout(Ne,0),ue=Date.now()),wt){let s=this;return new Promise(r=>{setTimeout(function(){r(s[t+"Async"].apply(s,e))},0)})}let i=this[t].apply(this,e);return n=i.then?i:new Promise(s=>s(i)),u&&n.then(u),n}}var J=0;function q(t={},e){function n(o){function l(h){h=h.data||h;let c=h.id,f=c&&s.h[c];f&&(f(h.msg),delete s.h[c])}if(this.worker=o,this.h=O(),this.worker)return i?this.worker.on("message",l):this.worker.onmessage=l,t.config?new Promise(function(h){J>1e9&&(J=0),s.h[++J]=function(){h(s)},s.worker.postMessage({id:J,task:"init",factory:u,options:t})}):(this.priority=t.priority||4,this.encoder=e||null,this.worker.postMessage({task:"init",factory:u,options:t}),this)}if(!this||this.constructor!==q)return new q(t);let u=typeof self<"u"?self._factory:typeof window<"u"?window._factory:null;u&&(u=u.toString());let i=typeof window>"u",s=this,r=We(u,i,t.worker);return r.then?r.then(function(o){return n.call(s,o)}):n.call(this,r)}Z("add");Z("append");Z("search");Z("update");Z("remove");Z("clear");Z("export");Z("import");q.prototype.searchCache=$t;Wt(q.prototype);function Z(t){q.prototype[t]=function(){let e=this,n=[].slice.call(arguments);var u=n[n.length-1];let i;return typeof u=="function"&&(i=u,n.pop()),u=new Promise(function(s){t==="export"&&typeof n[0]=="function"&&(n[0]=null),J>1e9&&(J=0),e.h[++J]=s,e.worker.postMessage({task:t,id:J,args:n})}),i?(u.then(i),this):u}}function We(t,e,n){return e?typeof module<"u"?new(Rt()).Worker(__dirname+"/worker/node.js"):Promise.resolve().then(()=>Yt(Rt(),1)).then(function(u){return new u.Worker(import.meta.dirname+"/node/node.mjs")}):t?new window.Worker(URL.createObjectURL(new Blob(["onmessage="+$e.toString()],{type:"text/javascript"}))):new window.Worker(typeof n=="string"?n:import.meta.url.replace("/worker.js","/worker/worker.js").replace("flexsearch.bundle.module.min.js","module/worker/worker.js").replace("flexsearch.bundle.module.min.mjs","module/worker/worker.js"),{type:"module"})}tt.prototype.add=function(t,e,n){if(at(t)&&(e=t,t=Dt(e,this.key)),e&&(t||t===0)){if(!n&&this.reg.has(t))return this.update(t,e);for(let o=0,l;o<this.field.length;o++){l=this.B[o];var u=this.index.get(this.field[o]);if(typeof l=="function"){var i=l(e);i&&u.add(t,i,n,!0)}else i=l.G,(!i||i(e))&&(l.constructor===String?l=[""+l]:N(l)&&(l=[l]),_t(e,l,this.D,0,u,t,l[0],n))}if(this.tag)for(u=0;u<this.A.length;u++){var s=this.A[u];i=this.tag.get(this.F[u]);let o=O();if(typeof s=="function"){if(s=s(e),!s)continue}else{var r=s.G;if(r&&!r(e))continue;s.constructor===String&&(s=""+s),s=Dt(e,s)}if(i&&s){N(s)&&(s=[s]);for(let l=0,h,c;l<s.length;l++)if(h=s[l],!o[h]&&(o[h]=1,(r=i.get(h))?c=r:i.set(h,c=[]),!n||!c.includes(t))){if(c.length===2**31-1){if(r=new lt(c),this.fastupdate)for(let f of this.reg.values())f.includes(c)&&(f[f.indexOf(c)]=r);i.set(h,c=r)}c.push(t),this.fastupdate&&((r=this.reg.get(t))?r.push(c):this.reg.set(t,[c]))}}}if(this.store&&(!n||!this.store.has(t))){let o;if(this.h){o=O();for(let l=0,h;l<this.h.length;l++){if(h=this.h[l],(n=h.G)&&!n(e))continue;let c;if(typeof h=="function"){if(c=h(e),!c)continue;h=[h.O]}else if(N(h)||h.constructor===String){o[h]=e[h];continue}zt(e,o,h,0,h[0],c)}}this.store.set(t,o||e)}this.worker&&(this.fastupdate||this.reg.add(t))}return this};function zt(t,e,n,u,i,s){if(t=t[i],u===n.length-1)e[i]=s||t;else if(t)if(t.constructor===Array)for(e=e[i]=Array(t.length),i=0;i<t.length;i++)zt(t,e,n,u,i);else e=e[i]||(e[i]=O()),i=n[++u],zt(t,e,n,u,i)}function _t(t,e,n,u,i,s,r,o){if(t=t[r])if(u===e.length-1){if(t.constructor===Array){if(n[u]){for(e=0;e<t.length;e++)i.add(s,t[e],!0,!0);return}t=t.join(" ")}i.add(s,t,o,!0)}else if(t.constructor===Array)for(r=0;r<t.length;r++)_t(t,e,n,u,i,s,r,o);else r=e[++u],_t(t,e,n,u,i,s,r,o)}function Kt(t,e,n,u){if(!t.length)return t;if(t.length===1)return t=t[0],t=n||t.length>e?t.slice(n,n+e):t,u?st.call(this,t):t;let i=[];for(let s=0,r,o;s<t.length;s++)if((r=t[s])&&(o=r.length)){if(n){if(n>=o){n-=o;continue}r=r.slice(n,n+e),o=r.length,n=0}if(o>e&&(r=r.slice(0,e),o=e),!i.length&&o>=e)return u?st.call(this,r):r;if(i.push(r),e-=o,!e)break}return i=i.length>1?[].concat.apply([],i):i[0],u?st.call(this,i):i}function Lt(t,e,n,u){var i=u[0];if(i[0]&&i[0].query)return t[e].apply(t,i);if(!(e!=="and"&&e!=="not"||t.result.length||t.await||i.suggest))return u.length>1&&(i=u[u.length-1]),(u=i.resolve)?t.await||t.result:t;let s=[],r=0,o=0,l,h,c,f,p;for(e=0;e<u.length;e++)if(i=u[e]){var a=void 0;if(i.constructor===j)a=i.await||i.result;else if(i.then||i.constructor===Array)a=i;else{r=i.limit||0,o=i.offset||0,c=i.suggest,h=i.resolve,l=((f=i.highlight||t.highlight)||i.enrich)&&h,a=i.queue;let d=i.async||a,D=i.index,g=i.query;if(D?t.index||(t.index=D):D=t.index,g||i.tag){let A=i.field||i.pluck;if(A&&(!g||t.query&&!f||(t.query=g,t.field=A,t.highlight=f),D=D.index.get(A)),a&&(p||t.await)){p=1;let F,B=t.C.length,L=new Promise(function(M){F=M});(function(M,S){L.h=function(){S.index=null,S.resolve=!1;let b=d?M.searchAsync(S):M.search(S);return b.then?b.then(function(y){return t.C[B]=y=y.result||y,F(y),y}):(b=b.result||b,F(b),b)}})(D,Object.assign({},i)),t.C.push(L),s[e]=L;continue}else i.resolve=!1,i.index=null,a=d?D.searchAsync(i):D.search(i),i.resolve=h,i.index=D}else if(i.and)a=At(i,"and",D);else if(i.or)a=At(i,"or",D);else if(i.not)a=At(i,"not",D);else if(i.xor)a=At(i,"xor",D);else continue}a.await?(p=1,a=a.await):a.then?(p=1,a=a.then(function(d){return d.result||d})):a=a.result||a,s[e]=a}if(p&&!t.await&&(t.await=new Promise(function(d){t.return=d})),p){let d=Promise.all(s).then(function(D){for(let g=0;g<t.C.length;g++)if(t.C[g]===d){t.C[g]=function(){return n.call(t,D,r,o,l,h,c,f)};break}Ut(t)});t.C.push(d)}else if(t.await)t.C.push(function(){return n.call(t,s,r,o,l,h,c,f)});else return n.call(t,s,r,o,l,h,c,f);return h?t.await||t.result:t}function At(t,e,n){t=t[e];let u=t[0]||t;return u.index||(u.index=n),n=new j(u),t.length>1&&(n=n[e].apply(n,t.slice(1))),n}j.prototype.or=function(){return Lt(this,"or",Ke,arguments)};function Ke(t,e,n,u,i,s,r){return t.length&&(this.result.length&&t.push(this.result),t.length<2?this.result=t[0]:(this.result=ae(t,e,n,!1,this.h),n=0)),i&&(this.await=null),i?this.resolve(e,n,u,r):this}j.prototype.and=function(){return Lt(this,"and",Ue,arguments)};function Ue(t,e,n,u,i,s,r){if(!s&&!this.result.length)return i?this.result:this;let o;if(t.length)if(this.result.length&&t.unshift(this.result),t.length<2)this.result=t[0];else{let l=0;for(let h=0,c,f;h<t.length;h++)if((c=t[h])&&(f=c.length))l<f&&(l=f);else if(!s){l=0;break}l?(this.result=Bt(t,l,e,n,s,this.h,i),o=!0):this.result=[]}else s||(this.result=t);return i&&(this.await=null),i?this.resolve(e,n,u,r,o):this}j.prototype.xor=function(){return Lt(this,"xor",Ve,arguments)};function Ve(t,e,n,u,i,s,r){if(t.length)if(this.result.length&&t.unshift(this.result),t.length<2)this.result=t[0];else{t:{s=n;var o=this.h;let l=[],h=O(),c=0;for(let f=0,p;f<t.length;f++)if(p=t[f]){c<p.length&&(c=p.length);for(let a=0,d;a<p.length;a++)if(d=p[a])for(let D=0,g;D<d.length;D++)g=d[D],h[g]=h[g]?2:1}for(let f=0,p,a=0;f<c;f++)for(let d=0,D;d<t.length;d++)if((D=t[d])&&(p=D[f])){for(let g=0,A;g<p.length;g++)if(A=p[g],h[A]===1)if(s)s--;else if(i){if(l.push(A),l.length===e){t=l;break t}}else{let F=f+(d?o:0);if(l[F]||(l[F]=[]),l[F].push(A),++a===e){t=l;break t}}}t=l}this.result=t,o=!0}else s||(this.result=t);return i&&(this.await=null),i?this.resolve(e,n,u,r,o):this}j.prototype.not=function(){return Lt(this,"not",Je,arguments)};function Je(t,e,n,u,i,s,r){if(!s&&!this.result.length)return i?this.result:this;if(t.length&&this.result.length){t:{s=n;var o=[];t=new Set(t.flat().flat());for(let l=0,h,c=0;l<this.result.length;l++)if(h=this.result[l]){for(let f=0,p;f<h.length;f++)if(p=h[f],!t.has(p)){if(s)s--;else if(i){if(o.push(p),o.length===e){t=o;break t}}else if(o[l]||(o[l]=[]),o[l].push(p),++c===e){t=o;break t}}}t=o}this.result=t,o=!0}return i&&(this.await=null),i?this.resolve(e,n,u,r,o):this}function xt(t,e,n,u,i){let s,r,o;typeof i=="string"?(s=i,i=""):s=i.template,r=s.indexOf("$1"),o=s.substring(r+2),r=s.substring(0,r);let l=i&&i.boundary,h=!i||i.clip!==!1,c=i&&i.merge&&o&&r&&new RegExp(o+" "+r,"g");i=i&&i.ellipsis;var f=0;if(typeof i=="object"){var p=i.template;f=p.length-2,i=i.pattern}typeof i!="string"&&(i=i===!1?"":"..."),f&&(i=p.replace("$1",i)),p=i.length-f;let a,d;typeof l=="object"&&(a=l.before,a===0&&(a=-1),d=l.after,d===0&&(d=-1),l=l.total||9e5),f=new Map;for(let $=0,H,Ft,ht;$<e.length;$++){let ct;if(u)ct=e,ht=u;else{var D=e[$];if(ht=D.field,!ht)continue;ct=D.result}Ft=n.get(ht),H=Ft.encoder,D=f.get(H),typeof D!="string"&&(D=H.encode(t),f.set(H,D));for(let mt=0;mt<ct.length;mt++){var g=ct[mt].doc;if(!g||(g=Dt(g,ht),!g))continue;var A=g.trim().split(/\\s+/);if(!A.length)continue;g="";var F=[];let Et=[];for(var B=-1,L=-1,M=0,S=0;S<A.length;S++){var b=A[S],y=H.encode(b);y=y.length>1?y.join(" "):y[0];let w;if(y&&b){for(var v=b.length,E=(H.split?b.replace(H.split,""):b).length-y.length,m="",x=0,T=0;T<D.length;T++){var R=D[T];if(R){var k=R.length;k+=E<0?0:E,x&&k<=x||(R=y.indexOf(R),R>-1&&(m=(R?b.substring(0,R):"")+r+b.substring(R,R+k)+o+(R+k<v?b.substring(R+k):""),x=k,w=!0))}}m&&(l&&(B<0&&(B=g.length+(g?1:0)),L=g.length+(g?1:0)+m.length,M+=v,Et.push(F.length),F.push({match:m})),g+=(g?" ":"")+m)}if(!w)b=A[S],g+=(g?" ":"")+b,l&&F.push({text:b});else if(l&&M>=l)break}if(M=Et.length*(s.length-2),a||d||l&&g.length-M>l)if(M=l+M-p*2,S=L-B,a>0&&(S+=a),d>0&&(S+=d),S<=M)A=a?B-(a>0?a:0):B-((M-S)/2|0),F=d?L+(d>0?d:0):A+M,h||(A>0&&g.charAt(A)!==" "&&g.charAt(A-1)!==" "&&(A=g.indexOf(" ",A),A<0&&(A=0)),F<g.length&&g.charAt(F-1)!==" "&&g.charAt(F)!==" "&&(F=g.lastIndexOf(" ",F),F<L?F=L:++F)),g=(A?i:"")+g.substring(A,F)+(F<g.length?i:"");else{for(L=[],B={},M={},S={},b={},y={},m=E=v=0,T=x=1;;){var z=void 0;for(let w=0,I;w<Et.length;w++){if(I=Et[w],m)if(E!==m){if(S[w+1])continue;if(I+=m,B[I]){v-=p,M[w+1]=1,S[w+1]=1;continue}if(I>=F.length-1){if(I>=F.length){S[w+1]=1,I>=A.length&&(M[w+1]=1);continue}v-=p}if(g=F[I].text,k=d&&y[w])if(k>0){if(g.length>k)if(S[w+1]=1,h)g=g.substring(0,k);else continue;(k-=g.length)||(k=-1),y[w]=k}else{S[w+1]=1;continue}if(v+g.length+1<=l)g=" "+g,L[w]+=g;else if(h)z=l-v-1,z>0&&(g=" "+g.substring(0,z),L[w]+=g),S[w+1]=1;else{S[w+1]=1;continue}}else{if(S[w])continue;if(I-=E,B[I]){v-=p,S[w]=1,M[w]=1;continue}if(I<=0){if(I<0){S[w]=1,M[w]=1;continue}v-=p}if(g=F[I].text,k=a&&b[w])if(k>0){if(g.length>k)if(S[w]=1,h)g=g.substring(g.length-k);else continue;(k-=g.length)||(k=-1),b[w]=k}else{S[w]=1;continue}if(v+g.length+1<=l)g+=" ",L[w]=g+L[w];else if(h)z=g.length+1-(l-v),z>=0&&z<g.length&&(g=g.substring(z)+" ",L[w]=g+L[w]),S[w]=1;else{S[w]=1;continue}}else{g=F[I].match,a&&(b[w]=a),d&&(y[w]=d),w&&v++;let Tt;if(I?!w&&p&&(v+=p):(M[w]=1,S[w]=1),I>=A.length-1||I<F.length-1&&F[I+1].match?Tt=1:p&&(v+=p),v-=s.length-2,!w||v+g.length<=l)L[w]=g;else{z=x=T=M[w]=0;break}Tt&&(M[w+1]=1,S[w+1]=1)}v+=g.length,z=B[I]=1}if(z)E===m?m++:E++;else{if(E===m?x=0:T=0,!x&&!T)break;x?(E++,m=E):m++}}g="";for(let w=0,I;w<L.length;w++)I=(M[w]?w?" ":"":(w&&!i?" ":"")+i)+L[w],g+=I;i&&!M[L.length]&&(g+=i)}c&&(g=g.replace(c," ")),ct[mt].highlight=g}if(u)break}return e}function j(t,e){if(!this||this.constructor!==j)return new j(t,e);let n=0,u,i,s,r,o,l;if(t&&t.index){let h=t;if(e=h.index,n=h.boost||0,i=h.query){s=h.field||h.pluck,r=h.highlight;let c=h.resolve;t=h.async||h.queue,h.resolve=!1,h.index=null,t=t?e.searchAsync(h):e.search(h),h.resolve=c,h.index=e,t=t.result||t}else t=[]}if(t&&t.then){let h=this;t=t.then(function(c){h.C[0]=h.result=c.result||c,Ut(h)}),u=[t],t=[],o=new Promise(function(c){l=c})}this.index=e||null,this.result=t||[],this.h=n,this.C=u||[],this.await=o||null,this.return=l||null,this.highlight=r||null,this.query=i||"",this.field=s||""}C=j.prototype;C.limit=function(t){if(this.await){let e=this;this.C.push(function(){return e.limit(t).result})}else if(this.result.length){let e=[];for(let n=0,u;n<this.result.length;n++)if(u=this.result[n])if(u.length<=t){if(e[n]=u,t-=u.length,!t)break}else{e[n]=u.slice(0,t);break}this.result=e}return this};C.offset=function(t){if(this.await){let e=this;this.C.push(function(){return e.offset(t).result})}else if(this.result.length){let e=[];for(let n=0,u;n<this.result.length;n++)(u=this.result[n])&&(u.length<=t?t-=u.length:(e[n]=u.slice(t),t=0));this.result=e}return this};C.boost=function(t){if(this.await){let e=this;this.C.push(function(){return e.boost(t).result})}else this.h+=t;return this};function Ut(t,e){let n=t.result;var u=t.await;t.await=null;for(let i=0,s;i<t.C.length;i++)if(s=t.C[i]){if(typeof s=="function")n=s(),t.C[i]=n=n.result||n,i--;else if(s.h)n=s.h(),t.C[i]=n=n.result||n,i--;else if(s.then)return t.await=u}return u=t.return,t.C=[],t.return=null,e||u(n),n}C.resolve=function(t,e,n,u,i){let s=this.await?Ut(this,!0):this.result;if(s.then){let r=this;return s.then(function(){return r.resolve(t,e,n,u,i)})}return s.length&&(typeof t=="object"?(u=t.highlight||this.highlight,n=!!u||t.enrich,e=t.offset,t=t.limit):(u=u||this.highlight,n=!!u||n),s=i?n?st.call(this.index,s):s:Kt.call(this.index,s,t||100,e,n)),this.finalize(s,u)};C.finalize=function(t,e){if(t.then){let u=this;return t.then(function(i){return u.finalize(i,e)})}e&&t.length&&this.query&&(t=xt(this.query,t,this.index.index,this.field,e));let n=this.return;return this.highlight=this.index=this.result=this.C=this.await=this.return=null,this.query=this.field="",n&&n(t),t};function Bt(t,e,n,u,i,s,r){let o=t.length,l=[],h,c;h=O();for(let f=0,p,a,d,D;f<e;f++)for(let g=0;g<o;g++)if(d=t[g],f<d.length&&(p=d[f]))for(let A=0;A<p.length;A++){if(a=p[A],(c=h[a])?h[a]++:(c=0,h[a]=1),D=l[c]||(l[c]=[]),!r){let F=f+(g||!i?0:s||0);D=D[F]||(D[F]=[])}if(D.push(a),r&&n&&c===o-1&&D.length-u===n)return u?D.slice(u):D}if(t=l.length)if(i)l=l.length>1?ae(l,n,u,r,s):(l=l[0])&&n&&l.length>n||u?l.slice(u,n+u):l;else{if(t<o)return[];if(l=l[t-1],n||u)if(r)(l.length>n||u)&&(l=l.slice(u,n+u));else{i=[];for(let f=0,p;f<l.length;f++)if(p=l[f]){if(u&&p.length>u)u-=p.length;else if((n&&p.length>n||u)&&(p=p.slice(u,n+u),n-=p.length,u&&(u-=p.length)),i.push(p),!n)break}l=i}}return l}function ae(t,e,n,u,i){let s=[],r=O(),o;var l=t.length;let h;if(u){for(i=l-1;i>=0;i--)if(h=(u=t[i])&&u.length){for(l=0;l<h;l++)if(o=u[l],!r[o]){if(r[o]=1,n)n--;else if(s.push(o),s.length===e)return s}}}else for(let c=l-1,f,p=0;c>=0;c--){f=t[c];for(let a=0;a<f.length;a++)if(h=(u=f[a])&&u.length){for(let d=0;d<h;d++)if(o=u[d],!r[o])if(r[o]=1,n)n--;else{let D=(a+(c<l-1&&i||0))/(c+1)|0;if((s[D]||(s[D]=[])).push(o),++p===e)return s}}}return s}function Ze(t,e,n,u,i){let s=O(),r=[];for(let o=0,l;o<e.length;o++){l=e[o];for(let h=0;h<l.length;h++)s[l[h]]=1}if(i){for(let o=0,l;o<t.length;o++)if(l=t[o],s[l]){if(u)u--;else if(r.push(l),s[l]=0,n&&--n===0)break}}else for(let o=0,l,h;o<t.result.length;o++)for(l=t.result[o],e=0;e<l.length;e++)h=l[e],s[h]&&((r[o]||(r[o]=[])).push(h),s[h]=0);return r}O();tt.prototype.search=function(t,e,n,u){n||(!e&&at(t)?(n=t,t=""):at(e)&&(n=e,e=0));let i=[];var s=[];let r,o,l,h,c,f,p=0,a=!0,d;if(n){n.constructor===Array&&(n={index:n}),t=n.query||t,r=n.pluck,o=n.merge,h=n.boost,f=r||n.field||(f=n.index)&&(f.index?null:f);var D=this.tag&&n.tag;l=n.suggest,a=n.resolve!==!1,c=n.cache,d=a&&this.store&&n.highlight;var g=!!d||a&&this.store&&n.enrich;e=n.limit||e;var A=n.offset||0;if(e||(e=a?100:0),D&&(!this.db||!u)){D.constructor!==Array&&(D=[D]);var F=[];for(let b=0,y;b<D.length;b++)if(y=D[b],y.field&&y.tag){var B=y.tag;if(B.constructor===Array)for(var L=0;L<B.length;L++)F.push(y.field,B[L]);else F.push(y.field,B)}else{B=Object.keys(y);for(let v=0,E,m;v<B.length;v++)if(E=B[v],m=y[E],m.constructor===Array)for(L=0;L<m.length;L++)F.push(E,m[L]);else F.push(E,m)}if(D=F,!t){if(s=[],F.length)for(D=0;D<F.length;D+=2){if(this.db){if(u=this.index.get(F[D]),!u)continue;s.push(u=u.db.tag(F[D+1],e,A,g))}else u=Qe.call(this,F[D],F[D+1],e,A,g);i.push(a?{field:F[D],tag:F[D+1],result:u}:[u])}if(s.length){let b=this;return Promise.all(s).then(function(y){for(let v=0;v<y.length;v++)a?i[v].result=y[v]:i[v]=y[v];return a?i:new j(i.length>1?Bt(i,1,0,0,l,h):i[0],b)})}return a?i:new j(i.length>1?Bt(i,1,0,0,l,h):i[0],this)}}a||r||!(f=f||this.field)||(N(f)?r=f:(f.constructor===Array&&f.length===1&&(f=f[0]),r=f.field||f.index)),f&&f.constructor!==Array&&(f=[f])}f||(f=this.field);let M;F=(this.worker||this.db)&&!u&&[];for(let b=0,y,v,E;b<f.length;b++){if(v=f[b],this.db&&this.tag&&!this.B[b])continue;let m;if(N(v)||(m=v,v=m.field,t=m.query||t,e=nt(m.limit,e),A=nt(m.offset,A),l=nt(m.suggest,l),d=a&&this.store&&nt(m.highlight,d),g=!!d||a&&this.store&&nt(m.enrich,g),c=nt(m.cache,c)),u)y=u[b];else{B=m||n||{},L=B.enrich;var S=this.index.get(v);if(D&&(this.db&&(B.tag=D,B.field=f,M=S.db.support_tag_search),!M&&L&&(B.enrich=!1),M||(B.limit=0,B.offset=0)),y=c?S.searchCache(t,D&&!M?0:e,B):S.search(t,D&&!M?0:e,B),D&&!M&&(B.limit=e,B.offset=A),L&&(B.enrich=L),F){F[b]=y;continue}}if(E=(y=y.result||y)&&y.length,D&&E){if(B=[],L=0,this.db&&u){if(!M)for(S=f.length;S<u.length;S++){let x=u[S];if(x&&x.length)L++,B.push(x);else if(!l)return a?i:new j(i,this)}}else for(let x=0,T,R;x<D.length;x+=2){if(T=this.tag.get(D[x]),!T){if(l)continue;return a?i:new j(i,this)}if(R=(T=T&&T.get(D[x+1]))&&T.length)L++,B.push(T);else if(!l)return a?i:new j(i,this)}if(L){if(y=Ze(y,B,e,A,a),E=y.length,!E&&!l)return a?y:new j(y,this);L--}}if(E)s[p]=v,i.push(y),p++;else if(f.length===1)return a?i:new j(i,this)}if(F){if(this.db&&D&&D.length&&!M)for(g=0;g<D.length;g+=2){if(s=this.index.get(D[g]),!s){if(l)continue;return a?i:new j(i,this)}F.push(s.db.tag(D[g+1],e,A,!1))}let b=this;return Promise.all(F).then(function(y){return n&&(n.resolve=a),y.length&&(y=b.search(t,e,n,y)),y})}if(!p)return a?i:new j(i,this);if(r&&(!g||!this.store))return i=i[0],a?i:new j(i,this);for(F=[],A=0;A<s.length;A++){if(D=i[A],g&&D.length&&typeof D[0].doc>"u"&&(this.db?F.push(D=this.index.get(this.field[0]).db.enrich(D)):D=st.call(this,D)),r)return a?d?xt(t,D,this.index,r,d):D:new j(D,this);i[A]={field:s[A],result:D}}if(g&&this.db&&F.length){let b=this;return Promise.all(F).then(function(y){for(let v=0;v<y.length;v++)i[v].result=y[v];return d&&(i=xt(t,i,b.index,r,d)),o?se(i):i})}return d&&(i=xt(t,i,this.index,r,d)),o?se(i):i};function se(t){let e=[],n=O(),u=O();for(let i=0,s,r,o,l,h,c,f;i<t.length;i++){s=t[i],r=s.field,o=s.result;for(let p=0;p<o.length;p++)h=o[p],typeof h!="object"?h={id:l=h}:l=h.id,(c=n[l])?c.push(r):(h.field=n[l]=[r],e.push(h)),(f=h.highlight)&&(c=u[l],c||(u[l]=c={},h.highlight=c),c[r]=f)}return e}function Qe(t,e,n,u,i){return t=this.tag.get(t),t?(t=t.get(e),t?(e=t.length-u,e>0&&((n&&e>n||u)&&(t=t.slice(u,u+n)),i&&(t=st.call(this,t))),t):[]):[]}function st(t){if(!this||!this.store)return t;if(this.db)return this.index.get(this.field[0]).db.enrich(t);let e=Array(t.length);for(let n=0,u;n<t.length;n++)u=t[n],e[n]={id:u,doc:this.store.get(u)};return e}function tt(t){if(!this||this.constructor!==tt)return new tt(t);let e=t.document||t.doc||t,n,u;if(this.B=[],this.field=[],this.D=[],this.key=(n=e.key||e.id)&&vt(n,this.D)||"id",(u=t.keystore||0)&&(this.keystore=u),this.fastupdate=!!t.fastupdate,this.reg=!this.fastupdate||t.worker||t.db?u?new K(u):new Set:u?new W(u):new Map,this.h=(n=e.store||null)&&n&&n!==!0&&[],this.store=n?u?new W(u):new Map:null,this.cache=(n=t.cache||null)&&new et(n),t.cache=!1,this.worker=t.worker||!1,this.priority=t.priority||4,this.index=Xe.call(this,t,e),this.tag=null,(n=e.tag)&&(typeof n=="string"&&(n=[n]),n.length)){this.tag=new Map,this.A=[],this.F=[];for(let i=0,s,r;i<n.length;i++){if(s=n[i],r=s.field||s,!r)throw Error("The tag field from the document descriptor is undefined.");s.custom?this.A[i]=s.custom:(this.A[i]=vt(r,this.D),s.filter&&(typeof this.A[i]=="string"&&(this.A[i]=new String(this.A[i])),this.A[i].G=s.filter)),this.F[i]=r,this.tag.set(r,new Map)}}if(this.worker){this.fastupdate=!1,t=[];for(let i of this.index.values())i.then&&t.push(i);if(t.length){let i=this;return Promise.all(t).then(function(s){let r=0;for(let o of i.index.entries()){let l=o[0],h=o[1];h.then&&(h=s[r],i.index.set(l,h),r++)}return i})}}else t.db&&(this.fastupdate=!1,this.mount(t.db))}C=tt.prototype;C.mount=function(t){let e=this.field;if(this.tag)for(let s=0,r;s<this.F.length;s++){r=this.F[s];var n=void 0;this.index.set(r,n=new U({},this.reg)),e===this.field&&(e=e.slice(0)),e.push(r),n.tag=this.tag.get(r)}n=[];let u={db:t.db,type:t.type,fastupdate:t.fastupdate};for(let s=0,r,o;s<e.length;s++){u.field=o=e[s],r=this.index.get(o);let l=new t.constructor(t.id,u);l.id=t.id,n[s]=l.mount(r),r.document=!0,s?r.bypass=!0:r.store=this.store}let i=this;return this.db=Promise.all(n).then(function(){i.db=!0})};C.commit=async function(){let t=[];for(let e of this.index.values())t.push(e.commit());await Promise.all(t),this.reg.clear()};C.destroy=function(){let t=[];for(let e of this.index.values())t.push(e.destroy());return Promise.all(t)};function Xe(t,e){let n=new Map,u=e.index||e.field||e;N(u)&&(u=[u]);for(let s=0,r,o;s<u.length;s++){if(r=u[s],N(r)||(o=r,r=r.field),o=at(o)?Object.assign({},t,o):t,this.worker){var i=void 0;i=(i=o.encoder)&&i.encode?i:new rt(typeof i=="string"?Nt[i]:i||{}),i=new q(o,i),n.set(r,i)}this.worker||n.set(r,new U(o,this.reg)),o.custom?this.B[s]=o.custom:(this.B[s]=vt(r,this.D),o.filter&&(typeof this.B[s]=="string"&&(this.B[s]=new String(this.B[s])),this.B[s].G=o.filter)),this.field[s]=r}if(this.h){t=e.store,N(t)&&(t=[t]);for(let s=0,r,o;s<t.length;s++)r=t[s],o=r.field||r,r.custom?(this.h[s]=r.custom,r.custom.O=o):(this.h[s]=vt(o,this.D),r.filter&&(typeof this.h[s]=="string"&&(this.h[s]=new String(this.h[s])),this.h[s].G=r.filter))}return n}function vt(t,e){let n=t.split(":"),u=0;for(let i=0;i<n.length;i++)t=n[i],t[t.length-1]==="]"&&(t=t.substring(0,t.length-2))&&(e[u]=!0),t&&(n[u++]=t);return u<n.length&&(n.length=u),u>1?n:n[0]}C.append=function(t,e){return this.add(t,e,!0)};C.update=function(t,e){return this.remove(t).add(t,e)};C.remove=function(t){at(t)&&(t=Dt(t,this.key));for(var e of this.index.values())e.remove(t,!0);if(this.reg.has(t)){if(this.tag&&!this.fastupdate)for(let n of this.tag.values())for(let u of n){e=u[0];let i=u[1],s=i.indexOf(t);s>-1&&(i.length>1?i.splice(s,1):n.delete(e))}this.store&&this.store.delete(t),this.reg.delete(t)}return this.cache&&this.cache.remove(t),this};C.clear=function(){let t=[];for(let e of this.index.values()){let n=e.clear();n.then&&t.push(n)}if(this.tag)for(let e of this.tag.values())e.clear();return this.store&&this.store.clear(),this.cache&&this.cache.clear(),t.length?Promise.all(t):this};C.contain=function(t){return this.db?this.index.get(this.field[0]).db.has(t):this.reg.has(t)};C.cleanup=function(){for(let t of this.index.values())t.cleanup();return this};C.get=function(t){return this.db?this.index.get(this.field[0]).db.enrich(t).then(function(e){return e[0]&&e[0].doc||null}):this.store.get(t)||null};C.set=function(t,e){return typeof t=="object"&&(e=t,t=Dt(e,this.key)),this.store.set(t,e),this};C.searchCache=$t;C.export=Ye;C.import=Ge;Wt(tt.prototype);function Vt(t,e=0){let n=[],u=[];e&&(e=25e4/e*5e3|0);for(let i of t.entries())u.push(i),u.length===e&&(n.push(u),u=[]);return u.length&&n.push(u),n}function Jt(t,e){e||(e=new Map);for(let n=0,u;n<t.length;n++)u=t[n],e.set(u[0],u[1]);return e}function De(t,e=0){let n=[],u=[];e&&(e=25e4/e*1e3|0);for(let i of t.entries())u.push([i[0],Vt(i[1])[0]||[]]),u.length===e&&(n.push(u),u=[]);return u.length&&n.push(u),n}function ge(t,e){e||(e=new Map);for(let n=0,u,i;n<t.length;n++)u=t[n],i=e.get(u[0]),e.set(u[0],Jt(u[1],i));return e}function pe(t){let e=[],n=[];for(let u of t.keys())n.push(u),n.length===25e4&&(e.push(n),n=[]);return n.length&&e.push(n),e}function de(t,e){e||(e=new Set);for(let n=0;n<t.length;n++)e.add(t[n]);return e}function kt(t,e,n,u,i,s,r=0){let o=u&&u.constructor===Array;var l=o?u.shift():u;if(!l)return this.export(t,e,i,s+1);if((l=t((e?e+".":"")+(r+1)+"."+n,JSON.stringify(l)))&&l.then){let h=this;return l.then(function(){return kt.call(h,t,e,n,o?u:null,i,s,r+1)})}return kt.call(this,t,e,n,o?u:null,i,s,r+1)}function Ye(t,e,n=0,u=0){if(n<this.field.length){let r=this.field[n];if((e=this.index.get(r).export(t,r,n,u=1))&&e.then){let o=this;return e.then(function(){return o.export(t,r,n+1)})}return this.export(t,r,n+1)}let i,s;switch(u){case 0:i="reg",s=pe(this.reg),e=null;break;case 1:i="tag",s=this.tag&&De(this.tag,this.reg.size),e=null;break;case 2:i="doc",s=this.store&&Vt(this.store),e=null;break;default:return}return kt.call(this,t,e,i,s||null,n,u)}function Ge(t,e){var n=t.split(".");n[n.length-1]==="json"&&n.pop();let u=n.length>2?n[0]:"";if(n=n.length>2?n[2]:n[1],this.worker&&u)return this.index.get(u).import(t);if(e){if(typeof e=="string"&&(e=JSON.parse(e)),u)return this.index.get(u).import(n,e);switch(n){case"reg":this.fastupdate=!1,this.reg=de(e,this.reg);for(let i=0,s;i<this.field.length;i++)s=this.index.get(this.field[i]),s.fastupdate=!1,s.reg=this.reg;if(this.worker){e=[];for(let i of this.index.values())e.push(i.import(t));return Promise.all(e)}break;case"tag":this.tag=ge(e,this.tag);break;case"doc":this.store=Jt(e,this.store)}}}function re(t,e){let n="";for(let u of t.entries()){t=u[0];let i=u[1],s="";for(let r=0,o;r<i.length;r++){o=i[r]||[""];let l="";for(let h=0;h<o.length;h++)l+=(l?",":"")+(e==="string"?'"'+o[h]+'"':o[h]);l="["+l+"]",s+=(s?",":"")+l}s='["'+t+'",['+s+"]]",n+=(n?",":"")+s}return n}U.prototype.remove=function(t,e){let n=this.reg.size&&(this.fastupdate?this.reg.get(t):this.reg.has(t));if(n){if(this.fastupdate){for(let u=0,i,s;u<n.length;u++)if((i=n[u])&&(s=i.length))if(i[s-1]===t)i.pop();else{let r=i.indexOf(t);r>=0&&i.splice(r,1)}}else gt(this.map,t),this.depth&&gt(this.ctx,t);e||this.reg.delete(t)}return this.db&&(this.commit_task.push({del:t}),this.M&&Fe(this)),this.cache&&this.cache.remove(t),this};function gt(t,e){let n=0;var u=typeof e>"u";if(t.constructor===Array){for(let i=0,s,r,o;i<t.length;i++)if((s=t[i])&&s.length){if(u)return 1;if(r=s.indexOf(e),r>=0){if(s.length>1)return s.splice(r,1),1;if(delete t[i],n)return 1;o=1}else{if(o)return 1;n++}}}else for(let i of t.entries())u=i[0],gt(i[1],e)?n++:t.delete(u);return n}var qe={memory:{resolution:1},performance:{resolution:3,fastupdate:!0,context:{depth:1,resolution:1}},match:{tokenize:"forward"},score:{resolution:9,context:{depth:2,resolution:3}}};U.prototype.add=function(t,e,n,u){if(e&&(t||t===0)){if(!u&&!n&&this.reg.has(t))return this.update(t,e);u=this.depth,e=this.encoder.encode(e,!u);let h=e.length;if(h){let c=O(),f=O(),p=this.resolution;for(let a=0;a<h;a++){let d=e[this.rtl?h-1-a:a];var i=d.length;if(i&&(u||!f[d])){var s=this.score?this.score(e,d,a,null,0):yt(p,h,a),r="";switch(this.tokenize){case"tolerant":if(V(this,f,d,s,t,n),i>2){for(let D=1,g,A,F,B;D<i-1;D++)g=d.charAt(D),A=d.charAt(D+1),F=d.substring(0,D)+A,B=d.substring(D+2),r=F+g+B,V(this,f,r,s,t,n),r=F+B,V(this,f,r,s,t,n);V(this,f,d.substring(0,d.length-1),s,t,n)}break;case"full":if(i>2){for(let D=0,g;D<i;D++)for(s=i;s>D;s--){r=d.substring(D,s),g=this.rtl?i-1-D:D;var o=this.score?this.score(e,d,a,r,g):yt(p,h,a,i,g);V(this,f,r,o,t,n)}break}case"bidirectional":case"reverse":if(i>1){for(o=i-1;o>0;o--){r=d[this.rtl?i-1-o:o]+r;var l=this.score?this.score(e,d,a,r,o):yt(p,h,a,i,o);V(this,f,r,l,t,n)}r=""}case"forward":if(i>1){for(o=0;o<i;o++)r+=d[this.rtl?i-1-o:o],V(this,f,r,s,t,n);break}default:if(V(this,f,d,s,t,n),u&&h>1&&a<h-1)for(i=this.N,r=d,s=Math.min(u+1,this.rtl?a+1:h-a),o=1;o<s;o++){d=e[this.rtl?h-1-a-o:a+o],l=this.bidirectional&&d>r;let D=this.score?this.score(e,r,a,d,o-1):yt(i+(h/2>i?0:1),h,a,s-1,o-1);V(this,c,l?r:d,D,t,n,l?d:r)}}}}this.fastupdate||this.reg.add(t)}}return this.db&&(this.commit_task.push(n?{ins:t}:{del:t}),this.M&&Fe(this)),this};function V(t,e,n,u,i,s,r){let o,l;if(!(o=e[n])||r&&!o[r]){if(r?(e=o||(e[n]=O()),e[r]=1,l=t.ctx,(o=l.get(r))?l=o:l.set(r,l=t.keystore?new W(t.keystore):new Map)):(l=t.map,e[n]=1),(o=l.get(n))?l=o:l.set(n,l=o=[]),s){for(let h=0,c;h<o.length;h++)if((c=o[h])&&c.includes(i)){if(h<=u)return;c.splice(c.indexOf(i),1),t.fastupdate&&(e=t.reg.get(i))&&e.splice(e.indexOf(c),1);break}}if(l=l[u]||(l[u]=[]),l.push(i),l.length===2**31-1){if(e=new lt(l),t.fastupdate)for(let h of t.reg.values())h.includes(l)&&(h[h.indexOf(l)]=e);o[u]=l=e}t.fastupdate&&((u=t.reg.get(i))?u.push(l):t.reg.set(i,[l]))}}function yt(t,e,n,u,i){return n&&t>1?e+(u||0)<=t?n+(i||0):(t-1)/(e+(u||0))*(n+(i||0))+1|0:0}U.prototype.search=function(t,e,n){if(n||(e||typeof t!="object"?typeof e=="object"&&(n=e,e=0):(n=t,t="")),n&&n.cache)return n.cache=!1,t=this.searchCache(t,e,n),n.cache=!0,t;let u=[],i,s,r,o=0,l,h,c,f,p;n&&(t=n.query||t,e=n.limit||e,o=n.offset||0,s=n.context,r=n.suggest,p=(l=n.resolve)&&n.enrich,c=n.boost,f=n.resolution,h=this.db&&n.tag),typeof l>"u"&&(l=this.resolve),s=this.depth&&s!==!1;let a=this.encoder.encode(t,!s);if(i=a.length,e=e||(l?100:0),i===1)return oe.call(this,a[0],"",e,o,l,p,h);if(i===2&&s&&!r)return oe.call(this,a[1],a[0],e,o,l,p,h);let d=O(),D=0,g;if(s&&(g=a[0],D=1),f||f===0||(f=g?this.N:this.resolution),this.db){if(this.db.search&&(n=this.db.search(this,a,e,o,r,l,p,h),n!==!1))return n;let A=this;return(async function(){for(let F,B;D<i;D++){if((B=a[D])&&!d[B]){if(d[B]=1,F=await Pt(A,B,g,0,0,!1,!1),F=he(F,u,r,f)){u=F;break}g&&(r&&F&&u.length||(g=B))}r&&g&&D===i-1&&!u.length&&(f=A.resolution,g="",D=-1,d=O())}return le(u,f,e,o,r,c,l)})()}for(let A,F;D<i;D++){if((F=a[D])&&!d[F]){if(d[F]=1,A=Pt(this,F,g,0,0,!1,!1),A=he(A,u,r,f)){u=A;break}g&&(r&&A&&u.length||(g=F))}r&&g&&D===i-1&&!u.length&&(f=this.resolution,g="",D=-1,d=O())}return le(u,f,e,o,r,c,l)};function le(t,e,n,u,i,s,r){let o=t.length,l=t;if(o>1)l=Bt(t,e,n,u,i,s,r);else if(o===1)return r?Kt.call(null,t[0],n,u):new j(t[0],this);return r?l:new j(l,this)}function oe(t,e,n,u,i,s,r){return t=Pt(this,t,e,n,u,i,s,r),this.db?t.then(function(o){return i?o||[]:new j(o,this)}):t&&t.length?i?Kt.call(this,t,n,u):new j(t,this):i?[]:new j([],this)}function he(t,e,n,u){let i=[];if(t&&t.length){if(t.length<=u){e.push(t);return}for(let s=0,r;s<u;s++)(r=t[s])&&(i[s]=r);if(i.length){e.push(i);return}}if(!n)return i}function Pt(t,e,n,u,i,s,r,o){let l;return n&&(l=t.bidirectional&&e>n)&&(l=n,n=e,e=l),t.db?t.db.get(e,n,u,i,s,r,o):(t=n?(t=t.ctx.get(n))&&t.get(e):t.map.get(e),t)}function U(t,e){if(!this||this.constructor!==U)return new U(t);if(t){var n=N(t)?t:t.preset;n&&(t=Object.assign({},qe[n],t))}else t={};n=t.context;let u=n===!0?{depth:1}:n||{},i=N(t.encoder)?Nt[t.encoder]:t.encode||t.encoder||{};this.encoder=i.encode?i:typeof i=="object"?new rt(i):{encode:i},this.resolution=t.resolution||9,this.tokenize=n=(n=t.tokenize)&&n!=="default"&&n!=="exact"&&n||"strict",this.depth=n==="strict"&&u.depth||0,this.bidirectional=u.bidirectional!==!1,this.fastupdate=!!t.fastupdate,this.score=t.score||null,(n=t.keystore||0)&&(this.keystore=n),this.map=n?new W(n):new Map,this.ctx=n?new W(n):new Map,this.reg=e||(this.fastupdate?n?new W(n):new Map:n?new K(n):new Set),this.N=u.resolution||3,this.rtl=i.rtl||t.rtl||!1,this.cache=(n=t.cache||null)&&new et(n),this.resolve=t.resolve!==!1,(n=t.db)&&(this.db=this.mount(n)),this.M=t.commit!==!1,this.commit_task=[],this.commit_timer=null,this.priority=t.priority||4}C=U.prototype;C.mount=function(t){return this.commit_timer&&(clearTimeout(this.commit_timer),this.commit_timer=null),t.mount(this)};C.commit=function(){return this.commit_timer&&(clearTimeout(this.commit_timer),this.commit_timer=null),this.db.commit(this)};C.destroy=function(){return this.commit_timer&&(clearTimeout(this.commit_timer),this.commit_timer=null),this.db.destroy()};function Fe(t){t.commit_timer||(t.commit_timer=setTimeout(function(){t.commit_timer=null,t.db.commit(t)},1))}C.clear=function(){return this.map.clear(),this.ctx.clear(),this.reg.clear(),this.cache&&this.cache.clear(),this.db?(this.commit_timer&&clearTimeout(this.commit_timer),this.commit_timer=null,this.commit_task=[],this.db.clear()):this};C.append=function(t,e){return this.add(t,e,!0)};C.contain=function(t){return this.db?this.db.has(t):this.reg.has(t)};C.update=function(t,e){let n=this,u=this.remove(t);return u&&u.then?u.then(()=>n.add(t,e)):this.add(t,e)};C.cleanup=function(){return this.fastupdate?(gt(this.map),this.depth&&gt(this.ctx),this):this};C.searchCache=$t;C.export=function(t,e,n=0,u=0){let i,s;switch(u){case 0:i="reg",s=pe(this.reg);break;case 1:i="cfg",s=null;break;case 2:i="map",s=Vt(this.map,this.reg.size);break;case 3:i="ctx",s=De(this.ctx,this.reg.size);break;default:return}return kt.call(this,t,e,i,s,n,u)};C.import=function(t,e){if(e)switch(typeof e=="string"&&(e=JSON.parse(e)),t=t.split("."),t[t.length-1]==="json"&&t.pop(),t.length===3&&t.shift(),t=t.length>1?t[1]:t[0],t){case"reg":this.fastupdate=!1,this.reg=de(e,this.reg);break;case"map":this.map=Jt(e,this.map);break;case"ctx":this.ctx=ge(e,this.ctx)}};C.serialize=function(t=!0){let e="",n="",u="";if(this.reg.size){let s;for(var i of this.reg.keys())s||(s=typeof i),e+=(e?",":"")+(s==="string"?'"'+i+'"':i);e="index.reg=new Set(["+e+"]);",n=re(this.map,s),n="index.map=new Map(["+n+"]);";for(let r of this.ctx.entries()){i=r[0];let o=re(r[1],s);o="new Map(["+o+"])",o='["'+i+'",'+o+"]",u+=(u?",":"")+o}u="index.ctx=new Map(["+u+"]);"}return t?"function inject(index){"+e+n+u+"}":e+n+u};Wt(U.prototype);var me=typeof window<"u"&&(window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB),bt=["map","ctx","tag","reg","cfg"],Y=O();function St(t,e={}){if(!this||this.constructor!==St)return new St(t,e);typeof t=="object"&&(e=t,t=t.name),t||console.info("Default storage space was used, because a name was not passed."),this.id="flexsearch"+(t?":"+t.toLowerCase().replace(/[^a-z0-9_\\-]/g,""):""),this.field=e.field?e.field.toLowerCase().replace(/[^a-z0-9_\\-]/g,""):"",this.type=e.type,this.fastupdate=this.support_tag_search=!1,this.db=null,this.h={}}C=St.prototype;C.mount=function(t){return t.index?t.mount(this):(t.db=this,this.open())};C.open=function(){if(this.db)return this.db;let t=this;navigator.storage&&navigator.storage.persist&&navigator.storage.persist(),Y[t.id]||(Y[t.id]=[]),Y[t.id].push(t.field);let e=me.open(t.id,1);return e.onupgradeneeded=function(){let n=t.db=this.result;for(let u=0,i;u<bt.length;u++){i=bt[u];for(let s=0,r;s<Y[t.id].length;s++)r=Y[t.id][s],n.objectStoreNames.contains(i+(i!=="reg"&&r?":"+r:""))||n.createObjectStore(i+(i!=="reg"&&r?":"+r:""))}},t.db=Q(e,function(n){t.db=n,t.db.onversionchange=function(){t.close()}})};C.close=function(){this.db&&this.db.close(),this.db=null};C.destroy=function(){let t=me.deleteDatabase(this.id);return Q(t)};C.clear=function(){let t=[];for(let n=0,u;n<bt.length;n++){u=bt[n];for(let i=0,s;i<Y[this.id].length;i++)s=Y[this.id][i],t.push(u+(u!=="reg"&&s?":"+s:""))}let e=this.db.transaction(t,"readwrite");for(let n=0;n<t.length;n++)e.objectStore(t[n]).clear();return Q(e)};C.get=function(t,e,n=0,u=0,i=!0,s=!1){t=this.db.transaction((e?"ctx":"map")+(this.field?":"+this.field:""),"readonly").objectStore((e?"ctx":"map")+(this.field?":"+this.field:"")).get(e?e+":"+t:t);let r=this;return Q(t).then(function(o){let l=[];if(!o||!o.length)return l;if(i){if(!n&&!u&&o.length===1)return o[0];for(let h=0,c;h<o.length;h++)if((c=o[h])&&c.length){if(u>=c.length){u-=c.length;continue}let f=n?u+Math.min(c.length-u,n):c.length;for(let p=u;p<f;p++)l.push(c[p]);if(u=0,l.length===n)break}return s?r.enrich(l):l}return o})};C.tag=function(t,e=0,n=0,u=!1){t=this.db.transaction("tag"+(this.field?":"+this.field:""),"readonly").objectStore("tag"+(this.field?":"+this.field:"")).get(t);let i=this;return Q(t).then(function(s){return!s||!s.length||n>=s.length?[]:!e&&!n?s:(s=s.slice(n,n+e),u?i.enrich(s):s)})};C.enrich=function(t){typeof t!="object"&&(t=[t]);let e=this.db.transaction("reg","readonly").objectStore("reg"),n=[];for(let u=0;u<t.length;u++)n[u]=Q(e.get(t[u]));return Promise.all(n).then(function(u){for(let i=0;i<u.length;i++)u[i]={id:t[i],doc:u[i]?JSON.parse(u[i]):null};return u})};C.has=function(t){return t=this.db.transaction("reg","readonly").objectStore("reg").getKey(t),Q(t).then(function(e){return!!e})};C.search=null;C.info=function(){};C.transaction=function(t,e,n){t+=t!=="reg"&&this.field?":"+this.field:"";let u=this.h[t+":"+e];if(u)return n.call(this,u);let i=this.db.transaction(t,e);this.h[t+":"+e]=u=i.objectStore(t);let s=n.call(this,u);return this.h[t+":"+e]=null,Q(i).finally(function(){return s})};C.commit=async function(t){let e=t.commit_task,n=[];t.commit_task=[];for(let u=0,i;u<e.length;u++)i=e[u],i.del&&n.push(i.del);n.length&&await this.remove(n),t.reg.size&&(await this.transaction("map","readwrite",function(u){for(let i of t.map){let s=i[0],r=i[1];r.length&&(u.get(s).onsuccess=function(){let o=this.result;var l;if(o&&o.length){let h=Math.max(o.length,r.length);for(let c=0,f,p;c<h;c++)if((p=r[c])&&p.length){if((f=o[c])&&f.length)for(l=0;l<p.length;l++)f.push(p[l]);else o[c]=p;l=1}}else o=r,l=1;l&&u.put(o,s)})}}),await this.transaction("ctx","readwrite",function(u){for(let i of t.ctx){let s=i[0],r=i[1];for(let o of r){let l=o[0],h=o[1];h.length&&(u.get(s+":"+l).onsuccess=function(){let c=this.result;var f;if(c&&c.length){let p=Math.max(c.length,h.length);for(let a=0,d,D;a<p;a++)if((D=h[a])&&D.length){if((d=c[a])&&d.length)for(f=0;f<D.length;f++)d.push(D[f]);else c[a]=D;f=1}}else c=h,f=1;f&&u.put(c,s+":"+l)})}}}),t.store?await this.transaction("reg","readwrite",function(u){for(let i of t.store){let s=i[0],r=i[1];u.put(typeof r=="object"?JSON.stringify(r):1,s)}}):t.bypass||await this.transaction("reg","readwrite",function(u){for(let i of t.reg.keys())u.put(1,i)}),t.tag&&await this.transaction("tag","readwrite",function(u){for(let i of t.tag){let s=i[0],r=i[1];r.length&&(u.get(s).onsuccess=function(){let o=this.result;o=o&&o.length?o.concat(r):r,u.put(o,s)})}}),t.map.clear(),t.ctx.clear(),t.tag&&t.tag.clear(),t.store&&t.store.clear(),t.document||t.reg.clear())};function Ot(t,e,n){let u=t.value,i,s=0;for(let r=0,o;r<u.length;r++){if(o=n?u:u[r]){for(let l=0,h,c;l<e.length;l++)if(c=e[l],h=o.indexOf(c),h>=0)if(i=1,o.length>1)o.splice(h,1);else{u[r]=[];break}s+=o.length}if(n)break}s?i&&t.update(u):t.delete(),t.continue()}C.remove=function(t){return typeof t!="object"&&(t=[t]),Promise.all([this.transaction("map","readwrite",function(e){e.openCursor().onsuccess=function(){let n=this.result;n&&Ot(n,t)}}),this.transaction("ctx","readwrite",function(e){e.openCursor().onsuccess=function(){let n=this.result;n&&Ot(n,t)}}),this.transaction("tag","readwrite",function(e){e.openCursor().onsuccess=function(){let n=this.result;n&&Ot(n,t,!0)}}),this.transaction("reg","readwrite",function(e){for(let n=0;n<t.length;n++)e.delete(t[n])})])};function Q(t,e){return new Promise((n,u)=>{t.onsuccess=t.oncomplete=function(){e&&e(this.result),e=null,n(this.result)},t.onerror=t.onblocked=u,t=null})}var Ee={Index:U,Charset:Nt,Encoder:rt,Document:tt,Worker:q,Resolver:j,IndexedDB:St,Language:{}};function Ce(t,e){if(!t)return;function n(i){i.target===this&&(i.preventDefault(),i.stopPropagation(),e())}function u(i){i.key.startsWith("Esc")&&(i.preventDefault(),e())}t?.addEventListener("click",n),window.addCleanup(()=>t?.removeEventListener("click",n)),document.addEventListener("keydown",u),window.addCleanup(()=>document.removeEventListener("keydown",u))}function pt(t){for(;t.firstChild;)t.removeChild(t.firstChild)}var wn=Object.hasOwnProperty;var we=Yt(ye(),1),nn=(0,we.default)();function un(t){let e=ke(on(t,"index"),!0);return e.length===0?"/":e}var xe=(t,e,n)=>{let u=new URL(t.getAttribute(e),n);t.setAttribute(e,u.pathname+u.hash)};function Be(t,e){t.querySelectorAll('[href=""], [href^="./"], [href^="../"]').forEach(n=>xe(n,"href",e)),t.querySelectorAll('[src=""], [src^="./"], [src^="../"]').forEach(n=>xe(n,"src",e))}function sn(t){let e=t.split("/").filter(n=>n!=="").slice(0,-1).map(n=>"..").join("/");return e.length===0&&(e="."),e}function ve(t,e){return rn(sn(t),un(e))}function rn(...t){if(t.length===0)return"";let e=t.filter(n=>n!==""&&n!=="/").map(n=>ke(n)).join("/");return t[0].startsWith("/")&&(e="/"+e),t[t.length-1].endsWith("/")&&(e=e+"/"),e}function ln(t,e){return t===e||t.endsWith("/"+e)}function on(t,e){return ln(t,e)&&(t=t.slice(0,-e.length)),t}function ke(t,e){return t.startsWith("/")&&(t=t.substring(1)),!e&&t.endsWith("/")&&(t=t.slice(0,-1)),t}var X="basic",P="",hn=t=>{let e=[],n=-1,u=-1,i=t.toLowerCase(),s=0;for(let r of i){let o=r.codePointAt(0);o>=12352&&o<=12447||o>=12448&&o<=12543||o>=19968&&o<=40959||o>=44032&&o<=55215||o>=131072&&o<=173791?(n!==-1&&(e.push(i.slice(n,u)),n=-1),e.push(r)):o===32||o===9||o===10||o===13?n!==-1&&(e.push(i.slice(n,u)),n=-1):(n===-1&&(n=s),u=s+r.length),s+=r.length}return n!==-1&&e.push(i.slice(n)),e},dt=new Ee.Document({encode:hn,document:{id:"id",tag:"tags",index:[{field:"title",tokenize:"forward"},{field:"content",tokenize:"forward"},{field:"tags",tokenize:"forward"}]}}),cn=new DOMParser,Zt=new Map,Mt=30,jt=8,fn=5,Le=t=>{let e=t.split(/\\s+/).filter(u=>u.trim()!==""),n=e.length;if(n>1)for(let u=1;u<n;u++)e.push(e.slice(0,u+1).join(" "));return e.sort((u,i)=>i.length-u.length)};function be(t,e,n){let u=Le(t),i=e.split(/\\s+/).filter(l=>l!==""),s=0,r=i.length-1;if(n){let l=p=>u.some(a=>p.toLowerCase().startsWith(a.toLowerCase())),h=i.map(l),c=0,f=0;for(let p=0;p<Math.max(i.length-Mt,0);p++){let d=h.slice(p,p+Mt).reduce((D,g)=>D+(g?1:0),0);d>=c&&(c=d,f=p)}s=Math.max(f-Mt,0),r=Math.min(s+2*Mt,i.length-1),i=i.slice(s,r)}let o=i.map(l=>{for(let h of u)if(l.toLowerCase().includes(h.toLowerCase())){let c=new RegExp(h.toLowerCase(),"gi");return l.replace(c,'<span class="highlight">$&</span>')}return l}).join(" ");return\`\${s===0?"":"..."}\${o}\${r===i.length-1?"":"..."}\`}function an(t,e){let n=new DOMParser,u=Le(t),i=n.parseFromString(e.innerHTML,"text/html"),s=o=>{let l=document.createElement("span");return l.className="highlight",l.textContent=o,l},r=(o,l)=>{if(o.nodeType===Node.TEXT_NODE){let h=o.nodeValue??"",c=new RegExp(l.toLowerCase(),"gi"),f=h.match(c);if(!f||f.length===0)return;let p=document.createElement("span"),a=0;for(let d of f){let D=h.indexOf(d,a);p.appendChild(document.createTextNode(h.slice(a,D))),p.appendChild(s(d)),a=D+d.length}p.appendChild(document.createTextNode(h.slice(a))),o.parentNode?.replaceChild(p,o)}else if(o.nodeType===Node.ELEMENT_NODE){if(o.classList.contains("highlight"))return;Array.from(o.childNodes).forEach(h=>r(h,l))}};for(let o of u)r(i.body,o);return i.body}async function Dn(t,e,n){let u=t.querySelector(".search-container");if(!u)return;let i=u.closest(".sidebar"),s=t.querySelector(".search-button");if(!s)return;let r=t.querySelector(".search-bar");if(!r)return;let o=t.querySelector(".search-layout");if(!o)return;let l=Object.keys(n),h=E=>{o.appendChild(E)},c=o.dataset.preview==="true",f,p,a=document.createElement("div");a.className="results-container",h(a),c&&(f=document.createElement("div"),f.className="preview-container",h(f));function d(){u.classList.remove("active"),r.value="",i&&(i.style.zIndex=""),pt(a),f&&pt(f),o.classList.remove("display-results"),X="basic",s.focus()}function D(E){X=E,i&&(i.style.zIndex="1"),u.classList.add("active"),r.focus()}let g=null;async function A(E){if(E.key==="k"&&(E.ctrlKey||E.metaKey)&&!E.shiftKey){E.preventDefault(),u.classList.contains("active")?d():D("basic");return}else if(E.shiftKey&&(E.ctrlKey||E.metaKey)&&E.key.toLowerCase()==="k"){E.preventDefault(),u.classList.contains("active")?d():D("tags"),r.value="#";return}if(g&&g.classList.remove("focus"),!!u.classList.contains("active")){if(E.key==="Enter"&&!E.isComposing)if(a.contains(document.activeElement)){let m=document.activeElement;if(m.classList.contains("no-match"))return;await y(m),m.click()}else{let m=document.getElementsByClassName("result-card")[0];if(!m||m.classList.contains("no-match"))return;await y(m),m.click()}else if(E.key==="ArrowUp"||E.shiftKey&&E.key==="Tab"){if(E.preventDefault(),a.contains(document.activeElement)){let m=g||document.activeElement,x=m?.previousElementSibling;m?.classList.remove("focus"),x?.focus(),x&&(g=x),await y(x)}}else if((E.key==="ArrowDown"||E.key==="Tab")&&(E.preventDefault(),document.activeElement===r||g!==null)){let m=g||document.getElementsByClassName("result-card")[0],x=m?.nextElementSibling;m?.classList.remove("focus"),x?.focus(),x&&(g=x),await y(x)}}}let F=(E,m)=>{let x=l[m];return{id:m,slug:x,title:X==="tags"?n[x].title:be(E,n[x].title??""),content:be(E,n[x].content??"",!0),tags:B(E.substring(1),n[x].tags)}};function B(E,m){return!m||X!=="tags"?[]:m.map(x=>x.toLowerCase().includes(E.toLowerCase())?\`<li><p class="match-tag">#\${x}</p></li>\`:\`<li><p>#\${x}</p></li>\`).slice(0,fn)}function L(E){return new URL(ve(e,E),location.toString())}let M=({slug:E,title:m,content:x,tags:T})=>{let R=T.length>0?\`<ul class="tags">\${T.join("")}</ul>\`:"",k=document.createElement("a");k.classList.add("result-card"),k.id=E,k.href=L(E).toString(),k.innerHTML=\`
      <h3 class="card-title">\${m}</h3>
      \${R}
      <p class="card-description">\${x}</p>
    \`,k.addEventListener("click",H=>{H.altKey||H.ctrlKey||H.metaKey||H.shiftKey||d()});let z=H=>{H.altKey||H.ctrlKey||H.metaKey||H.shiftKey||d()};async function $(H){if(!H.target)return;let Ft=H.target;await y(Ft)}return k.addEventListener("mouseenter",$),window.addCleanup(()=>k.removeEventListener("mouseenter",$)),k.addEventListener("click",z),window.addCleanup(()=>k.removeEventListener("click",z)),k};async function S(E){if(pt(a),E.length===0?a.innerHTML=\`<a class="result-card no-match">
          <h3>No results.</h3>
          <p>Try another search term?</p>
      </a>\`:a.append(...E.map(M)),E.length===0&&f)pt(f);else{let m=a.firstElementChild;m.classList.add("focus"),g=m,await y(m)}}async function b(E){if(Zt.has(E))return Zt.get(E);let m=L(E).toString(),x=await fetch(m).then(T=>T.text()).then(T=>{if(T===void 0)throw new Error(\`Could not fetch \${m}\`);let R=cn.parseFromString(T??"","text/html");return Be(R,m),[...R.getElementsByClassName("popover-hint")]});return Zt.set(E,x),x}async function y(E){if(!o||!c||!E||!f)return;let m=E.id,x=await b(m).then(R=>R.flatMap(k=>[...an(P,k).children]));p=document.createElement("div"),p.classList.add("preview-inner"),p.append(...x),f.replaceChildren(p),[...f.getElementsByClassName("highlight")].sort((R,k)=>k.innerHTML.length-R.innerHTML.length)[0]?.scrollIntoView({block:"start"})}async function v(E){if(!o||!dt)return;P=E.target.value,o.classList.toggle("display-results",P!==""),X=P.startsWith("#")?"tags":"basic";let m;if(X==="tags"){P=P.substring(1).trim();let k=P.indexOf(" ");if(k!=-1){let z=P.substring(0,k),$=P.substring(k+1).trim();m=await dt.searchAsync({query:$,limit:Math.max(jt,1e4),index:["title","content"],tag:{tags:z}});for(let H of m)H.result=H.result.slice(0,jt);X="basic",P=$}else m=await dt.searchAsync({query:P,limit:jt,index:["tags"]})}else X==="basic"&&(m=await dt.searchAsync({query:P,limit:jt,index:["title","content"]}));let x=k=>{let z=m.filter($=>$.field===k);return z.length===0?[]:[...z[0].result]},R=[...new Set([...x("title"),...x("content"),...x("tags")])].map(k=>F(P,k));await S(R)}document.addEventListener("keydown",A),window.addCleanup(()=>document.removeEventListener("keydown",A)),s.addEventListener("click",()=>D("basic")),window.addCleanup(()=>s.removeEventListener("click",()=>D("basic"))),r.addEventListener("input",v),window.addCleanup(()=>r.removeEventListener("input",v)),Ce(u,d),await gn(n)}var Se=!1;async function gn(t){if(Se)return;let e=0,n=[];for(let[u,i]of Object.entries(t))n.push(dt.addAsync(e++,{id:e,slug:u,title:i.title,content:i.content,tags:i.tags}));await Promise.all(n),Se=!0}document.addEventListener("nav",async t=>{let e=t.detail.url,n=await fetchData,u=document.getElementsByClassName("search");for(let i of u)await Dn(i,e,n)});
`;import{jsx as jsx28,jsxs as jsxs17}from"preact/jsx-runtime";var defaultOptions14={enablePreview:!0},Search_default=__name((userOpts=>{let Search=__name(({displayClass,cfg})=>{let opts={...defaultOptions14,...userOpts},searchPlaceholder=i18n(cfg.locale).components.search.searchBarPlaceholder;return jsxs17("div",{class:classNames(displayClass,"search"),children:[jsxs17("button",{class:"search-button",children:[jsxs17("svg",{role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 19.9 19.7",children:[jsx28("title",{children:"Search"}),jsxs17("g",{class:"search-path",fill:"none",children:[jsx28("path",{"stroke-linecap":"square",d:"M18.5 18.3l-5.4-5.4"}),jsx28("circle",{cx:"8",cy:"8",r:"7"})]})]}),jsx28("p",{children:i18n(cfg.locale).components.search.title})]}),jsx28("div",{class:"search-container",children:jsxs17("div",{class:"search-space",children:[jsx28("input",{autocomplete:"off",class:"search-bar",name:"search",type:"text","aria-label":searchPlaceholder,placeholder:searchPlaceholder}),jsx28("div",{class:"search-layout","data-preview":opts.enablePreview})]})})]})},"Search");return Search.afterDOMLoaded=search_inline_default,Search.css=search_default,Search}),"default");var footer_default=`footer {
  text-align: left;
  margin-bottom: 4rem;
  opacity: 0.7;
}
footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: -1rem;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJmb290ZXIge1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBtYXJnaW4tYm90dG9tOiA0cmVtO1xuICBvcGFjaXR5OiAwLjc7XG5cbiAgJiB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgZ2FwOiAxcmVtO1xuICAgIG1hcmdpbi10b3A6IC0xcmVtO1xuICB9XG59XG4iXX0= */`;var version="4.5.2";import{jsx as jsx29,jsxs as jsxs18}from"preact/jsx-runtime";var Footer_default=__name((opts=>{let Footer=__name(({displayClass,cfg})=>{let year=new Date().getFullYear(),links=opts?.links??[];return jsxs18("footer",{class:`${displayClass??""}`,children:[jsxs18("p",{children:[i18n(cfg.locale).components.footer.createdWith," ",jsxs18("a",{href:"https://quartz.jzhao.xyz/",children:["Quartz v",version]})," \xA9 ",year]}),jsx29("ul",{children:Object.entries(links).map(([text,link])=>jsx29("li",{children:jsx29("a",{href:link,children:text})}))})]})},"Footer");return Footer.css=footer_default,Footer}),"default");import{jsx as jsx30}from"preact/jsx-runtime";var DesktopOnly_default=__name((component=>{let Component=component,DesktopOnly=__name(props=>jsx30(Component,{displayClass:"desktop-only",...props}),"DesktopOnly");return DesktopOnly.displayName=component.displayName,DesktopOnly.afterDOMLoaded=component?.afterDOMLoaded,DesktopOnly.beforeDOMLoaded=component?.beforeDOMLoaded,DesktopOnly.css=component?.css,DesktopOnly}),"default");import{jsx as jsx31}from"preact/jsx-runtime";import{jsx as jsx32,jsxs as jsxs19}from"preact/jsx-runtime";var breadcrumbs_default=`.breadcrumb-container {
  margin: 0;
  margin-top: 0.75rem;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.breadcrumb-element p {
  margin: 0;
  margin-left: 0.5rem;
  padding: 0;
  line-height: normal;
}
.breadcrumb-element {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyZWFkY3J1bWJzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBSUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFMSjtFQU9FO0VBQ0E7RUFDQTtFQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLmJyZWFkY3J1bWItY29udGFpbmVyIHtcbiAgbWFyZ2luOiAwO1xuICBtYXJnaW4tdG9wOiAwLjc1cmVtO1xuICBwYWRkaW5nOiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogMC41cmVtO1xufVxuXG4uYnJlYWRjcnVtYi1lbGVtZW50IHtcbiAgcCB7XG4gICAgbWFyZ2luOiAwO1xuICAgIG1hcmdpbi1sZWZ0OiAwLjVyZW07XG4gICAgcGFkZGluZzogMDtcbiAgICBsaW5lLWhlaWdodDogbm9ybWFsO1xuICB9XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuIl19 */`;import{jsx as jsx33,jsxs as jsxs20}from"preact/jsx-runtime";var defaultOptions15={spacerSymbol:"\u276F",rootName:"Home",resolveFrontmatterTitle:!0,showCurrentPage:!0};function formatCrumb(displayName,baseSlug,currentSlug){return{displayName:displayName.replaceAll("-"," "),path:resolveRelative(baseSlug,currentSlug)}}__name(formatCrumb,"formatCrumb");var Breadcrumbs_default=__name((opts=>{let options2={...defaultOptions15,...opts},Breadcrumbs=__name(({fileData,allFiles,displayClass,ctx})=>{let trie=ctx.trie??=trieFromAllFiles(allFiles),slugParts=fileData.slug.split("/"),pathNodes=trie.ancestryChain(slugParts);if(!pathNodes)return null;let crumbs=pathNodes.map((node,idx)=>{let crumb=formatCrumb(node.displayName,fileData.slug,simplifySlug(node.slug));return idx===0&&(crumb.displayName=options2.rootName),idx===pathNodes.length-1&&(crumb.path=""),crumb});return options2.showCurrentPage||crumbs.pop(),jsx33("nav",{class:classNames(displayClass,"breadcrumb-container"),"aria-label":"breadcrumbs",children:crumbs.map((crumb,index)=>jsxs20("div",{class:"breadcrumb-element",children:[jsx33("a",{href:crumb.path,children:crumb.displayName}),index!==crumbs.length-1&&jsx33("p",{children:` ${options2.spacerSymbol} `})]}))})},"Breadcrumbs");return Breadcrumbs.css=breadcrumbs_default,Breadcrumbs}),"default");var comments_inline_default='var a=e=>{let t=e.detail.theme,s=document.querySelector("iframe.giscus-frame");s&&s.contentWindow&&s.contentWindow.postMessage({giscus:{setConfig:{theme:i(n(t))}}},"https://giscus.app")},n=e=>{if(e!=="dark"&&e!=="light")return e;let t=document.querySelector(".giscus");if(!t)return e;let s=t.dataset.darkTheme??"dark",r=t.dataset.lightTheme??"light";return e==="dark"?s:r},i=e=>{let t=document.querySelector(".giscus");return t?`${t.dataset.themeUrl??"https://giscus.app/themes"}/${e}.css`:`https://giscus.app/themes/${e}.css`};document.addEventListener("nav",()=>{let e=document.querySelector(".giscus");if(!e)return;let t=document.createElement("script");t.src="https://giscus.app/client.js",t.async=!0,t.crossOrigin="anonymous",t.setAttribute("data-loading","lazy"),t.setAttribute("data-emit-metadata","0"),t.setAttribute("data-repo",e.dataset.repo),t.setAttribute("data-repo-id",e.dataset.repoId),t.setAttribute("data-category",e.dataset.category),t.setAttribute("data-category-id",e.dataset.categoryId),t.setAttribute("data-mapping",e.dataset.mapping),t.setAttribute("data-strict",e.dataset.strict),t.setAttribute("data-reactions-enabled",e.dataset.reactionsEnabled),t.setAttribute("data-input-position",e.dataset.inputPosition),t.setAttribute("data-lang",e.dataset.lang);let s=document.documentElement.getAttribute("saved-theme");s&&t.setAttribute("data-theme",i(n(s))),e.appendChild(t),document.addEventListener("themechange",a),window.addCleanup(()=>document.removeEventListener("themechange",a))});\n';import{Fragment as Fragment5,jsx as jsx34}from"preact/jsx-runtime";function boolToStringBool(b){return b?"1":"0"}__name(boolToStringBool,"boolToStringBool");var Comments_default=__name((opts=>{let Comments=__name(({displayClass,fileData,cfg})=>typeof fileData.frontmatter?.comments<"u"&&(!fileData.frontmatter?.comments||fileData.frontmatter?.comments==="false")?jsx34(Fragment5,{}):jsx34("div",{class:classNames(displayClass,"giscus"),"data-repo":opts.options.repo,"data-repo-id":opts.options.repoId,"data-category":opts.options.category,"data-category-id":opts.options.categoryId,"data-mapping":opts.options.mapping??"url","data-strict":boolToStringBool(opts.options.strict??!0),"data-reactions-enabled":boolToStringBool(opts.options.reactionsEnabled??!0),"data-input-position":opts.options.inputPosition??"bottom","data-light-theme":opts.options.lightTheme??"light","data-dark-theme":opts.options.darkTheme??"dark","data-theme-url":opts.options.themeUrl??`https://${cfg.baseUrl??"example.com"}/static/giscus`,"data-lang":opts.options.lang??"en"}),"Comments");return Comments.afterDOMLoaded=comments_inline_default,Comments}),"default");import{jsx as jsx35}from"preact/jsx-runtime";import{jsx as jsx36}from"preact/jsx-runtime";var ConditionalRender_default=__name((config2=>{let ConditionalRender=__name(props=>config2.condition(props)?jsx36(config2.component,{...props}):null,"ConditionalRender");return ConditionalRender.afterDOMLoaded=config2.component.afterDOMLoaded,ConditionalRender.beforeDOMLoaded=config2.component.beforeDOMLoaded,ConditionalRender.css=config2.component.css,ConditionalRender}),"default");import{jsx as jsx37,jsxs as jsxs21}from"preact/jsx-runtime";var ProfileCard=__name(()=>jsxs21("div",{class:"profile-card",children:[jsx37("a",{href:"/",class:"profile-avatar-link",children:jsx37("img",{src:"static/head.jpeg",alt:"avatar",class:"profile-avatar"})}),jsx37("div",{class:"profile-name",children:"\u6B65\u516D\u5B64"}),jsx37("div",{class:"profile-motto",children:"\u300C\u751F\u4E8E\u6808\uFF0C\u957F\u4E8E\u5806\uFF0C\u5F52\u4E8E\u5C18\u300D"}),jsxs21("div",{class:"profile-nav",children:[jsx37("a",{href:"/",children:"\u{1F3E0} \u9996\u9875"}),jsx37("a",{href:"/tags",children:"\u{1F3F7}\uFE0F \u6807\u7B7E"}),jsx37("a",{href:"/navigation",children:"\u{1F517} \u5BFC\u822A"})]})]}),"ProfileCard"),ProfileCard_default=ProfileCard;import{jsx as jsx38,jsxs as jsxs22}from"preact/jsx-runtime";var Busuanzi=__name(()=>jsxs22("div",{style:"text-align:center; margin: 2rem 0; color: var(--gray); font-size:0.9rem;",children:[jsxs22("span",{id:"busuanzi_container_site_pv",children:["\u{1F440} \u603B\u8BBF\u95EE\u91CF ",jsx38("span",{id:"busuanzi_value_site_pv"})," \u6B21"]}),"\xA0|\xA0",jsxs22("span",{id:"busuanzi_container_site_uv",children:["\u{1F9D1}\u200D\u{1F4BB} \u8BBF\u5BA2\u6570 ",jsx38("span",{id:"busuanzi_value_site_uv"})," \u4EBA"]}),jsx38("script",{async:!0,src:"//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"})]}),"Busuanzi"),Busuanzi_default=Busuanzi;var sharedPageComponents={head:Head_default(),header:[Busuanzi_default],afterBody:[Comments_default({provider:"giscus",options:{repo:"todaymvp/todaymvp.github.io",repoId:"R_kgDOSgiQwQ",category:"Announcements",categoryId:"DIC_kwDOSgiQwc4C9SjX",mapping:"pathname",strict:!1,reactionsEnabled:!0,emitMetadata:!1,inputPosition:"top",theme:"light",lightTheme:"light",darkTheme:"light",lang:"zh-CN"}})],footer:Footer_default({links:{GitHub:"https://github.com/todaymvp",RSS:"/index.xml",\u5173\u4E8E:"/navigation"}})},defaultContentPageLayout={beforeBody:[ConditionalRender_default({component:Breadcrumbs_default(),condition:__name(page=>page.fileData.slug!=="index","condition")}),ArticleTitle_default(),ContentMeta_default(),TagList_default()],left:[PageTitle_default(),Search_default(),Darkmode_default(),Explorer_default()],right:[ProfileCard_default]},defaultListPageLayout={beforeBody:[Breadcrumbs_default(),ArticleTitle_default(),ContentMeta_default()],left:[PageTitle_default(),Search_default(),Explorer_default()],right:[ProfileCard_default,DesktopOnly_default(TableOfContents_default())]};import{styleText as styleText6}from"util";async function processContent(ctx,tree,fileData,allFiles,opts,resources){let slug=fileData.slug,cfg=ctx.cfg.configuration,externalResources=pageResources(pathToRoot(slug),resources),content=renderPage(cfg,slug,{ctx,fileData,externalResources,cfg,children:[],tree,allFiles},opts,externalResources);return write({ctx,content,slug,ext:".html"})}__name(processContent,"processContent");var ContentPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultContentPageLayout,pageBody:Content_default(),...userOpts},{head:Head,header,beforeBody,pageBody,afterBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"ContentPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...afterBody,...left,...right,Footer]},async*emit(ctx,content,resources){let allFiles=content.map(c=>c[1].data),containsIndex=!1;for(let[tree,file]of content){let slug=file.data.slug;slug==="index"&&(containsIndex=!0),!(slug.endsWith("/index")||slug.startsWith("tags/"))&&(yield processContent(ctx,tree,file.data,allFiles,opts,resources))}containsIndex||console.log(styleText6("yellow",`
Warning: you seem to be missing an \`index.md\` home page file at the root of your \`${ctx.argv.directory}\` folder (\`${path6.join(ctx.argv.directory,"index.md")} does not exist\`). This may cause errors when deploying.`))},async*partialEmit(ctx,content,resources,changeEvents){let allFiles=content.map(c=>c[1].data),changedSlugs=new Set;for(let changeEvent of changeEvents)changeEvent.file&&(changeEvent.type==="add"||changeEvent.type==="change")&&changedSlugs.add(changeEvent.file.data.slug);for(let[tree,file]of content){let slug=file.data.slug;changedSlugs.has(slug)&&(slug.endsWith("/index")||slug.startsWith("tags/")||(yield processContent(ctx,tree,file.data,allFiles,opts,resources)))}}}},"ContentPage");import{VFile}from"vfile";function defaultProcessedContent(vfileData){let root={type:"root",children:[]},vfile=new VFile("");return vfile.data=vfileData,[root,vfile]}__name(defaultProcessedContent,"defaultProcessedContent");function computeTagInfo(allFiles,content,locale){let tags=new Set(allFiles.flatMap(data=>data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes));tags.add("index");let tagDescriptions=Object.fromEntries([...tags].map(tag=>{let title=tag==="index"?i18n(locale).pages.tagContent.tagIndex:`${i18n(locale).pages.tagContent.tag}: ${tag}`;return[tag,defaultProcessedContent({slug:joinSegments("tags",tag),frontmatter:{title,tags:[]}})]}));for(let[tree,file]of content){let slug=file.data.slug;if(slug.startsWith("tags/")){let tag=slug.slice(5);tags.has(tag)&&(tagDescriptions[tag]=[tree,file],file.data.frontmatter?.title===tag&&(file.data.frontmatter.title=`${i18n(locale).pages.tagContent.tag}: ${tag}`))}}return[tags,tagDescriptions]}__name(computeTagInfo,"computeTagInfo");async function processTagPage(ctx,tag,tagContent,allFiles,opts,resources){let slug=joinSegments("tags",tag),[tree,file]=tagContent,cfg=ctx.cfg.configuration,externalResources=pageResources(pathToRoot(slug),resources),componentData={ctx,fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content=renderPage(cfg,slug,componentData,opts,externalResources);return write({ctx,content,slug:file.data.slug,ext:".html"})}__name(processTagPage,"processTagPage");var TagPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultListPageLayout,pageBody:TagContent_default({sort:userOpts?.sort}),...userOpts},{head:Head,header,beforeBody,pageBody,afterBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"TagPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...afterBody,...left,...right,Footer]},async*emit(ctx,content,resources){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,[tags,tagDescriptions]=computeTagInfo(allFiles,content,cfg.locale);for(let tag of tags)yield processTagPage(ctx,tag,tagDescriptions[tag],allFiles,opts,resources)},async*partialEmit(ctx,content,resources,changeEvents){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,affectedTags=new Set;for(let changeEvent of changeEvents){if(!changeEvent.file)continue;let slug=changeEvent.file.data.slug;if(slug.startsWith("tags/")){let tag=slug.slice(5);affectedTags.add(tag)}(changeEvent.file.data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes).forEach(tag=>affectedTags.add(tag)),affectedTags.add("index")}if(affectedTags.size>0){let[_tags,tagDescriptions]=computeTagInfo(allFiles,content,cfg.locale);for(let tag of affectedTags)tagDescriptions[tag]&&(yield processTagPage(ctx,tag,tagDescriptions[tag],allFiles,opts,resources))}}}},"TagPage");import path7 from"path";async function*processFolderInfo(ctx,folderInfo,allFiles,opts,resources){for(let[folder,folderContent]of Object.entries(folderInfo)){let slug=joinSegments(folder,"index"),[tree,file]=folderContent,cfg=ctx.cfg.configuration,externalResources=pageResources(pathToRoot(slug),resources),componentData={ctx,fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content=renderPage(cfg,slug,componentData,opts,externalResources);yield write({ctx,content,slug,ext:".html"})}}__name(processFolderInfo,"processFolderInfo");function computeFolderInfo(folders,content,locale){let folderInfo=Object.fromEntries([...folders].map(folder=>[folder,defaultProcessedContent({slug:joinSegments(folder,"index"),frontmatter:{title:`${i18n(locale).pages.folderContent.folder}: ${folder}`,tags:[]}})]));for(let[tree,file]of content){let slug=stripSlashes(simplifySlug(file.data.slug));folders.has(slug)&&(folderInfo[slug]=[tree,file])}return folderInfo}__name(computeFolderInfo,"computeFolderInfo");function _getFolders(slug){var folderName=path7.dirname(slug??"");let parentFolderNames=[folderName];for(;folderName!==".";)folderName=path7.dirname(folderName??""),parentFolderNames.push(folderName);return parentFolderNames}__name(_getFolders,"_getFolders");var FolderPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultListPageLayout,pageBody:FolderContent_default({sort:userOpts?.sort}),...userOpts},{head:Head,header,beforeBody,pageBody,afterBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"FolderPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...afterBody,...left,...right,Footer]},async*emit(ctx,content,resources){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,folders=new Set(allFiles.flatMap(data=>data.slug?_getFolders(data.slug).filter(folderName=>folderName!=="."&&folderName!=="tags"):[])),folderInfo=computeFolderInfo(folders,content,cfg.locale);yield*processFolderInfo(ctx,folderInfo,allFiles,opts,resources)},async*partialEmit(ctx,content,resources,changeEvents){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,affectedFolders=new Set;for(let changeEvent of changeEvents){if(!changeEvent.file)continue;let slug=changeEvent.file.data.slug;_getFolders(slug).filter(folderName=>folderName!=="."&&folderName!=="tags").forEach(folder=>affectedFolders.add(folder))}if(affectedFolders.size>0){let folderInfo=computeFolderInfo(affectedFolders,content,cfg.locale);yield*processFolderInfo(ctx,folderInfo,allFiles,opts,resources)}}}},"FolderPage");import{toHtml as toHtml2}from"hast-util-to-html";import{jsx as jsx39}from"preact/jsx-runtime";var defaultOptions16={enableSiteMap:!0,enableRSS:!0,rssLimit:10,rssFullHtml:!1,rssSlug:"index",includeEmptyFiles:!0};function generateSiteMap(cfg,idx){let base=cfg.baseUrl??"",createURLEntry=__name((slug,content)=>`<url>
    <loc>https://${joinSegments(base,encodeURI(slug))}</loc>
    ${content.date&&`<lastmod>${content.date.toISOString()}</lastmod>`}
  </url>`,"createURLEntry");return`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${Array.from(idx).map(([slug,content])=>createURLEntry(simplifySlug(slug),content)).join("")}</urlset>`}__name(generateSiteMap,"generateSiteMap");function generateRSSFeed(cfg,idx,limit){let base=cfg.baseUrl??"",createURLEntry=__name((slug,content)=>`<item>
    <title>${escapeHTML(content.title)}</title>
    <link>https://${joinSegments(base,encodeURI(slug))}</link>
    <guid>https://${joinSegments(base,encodeURI(slug))}</guid>
    <description><![CDATA[ ${content.richContent??content.description} ]]></description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`,"createURLEntry"),items=Array.from(idx).sort(([_,f1],[__,f2])=>f1.date&&f2.date?f2.date.getTime()-f1.date.getTime():f1.date&&!f2.date?-1:!f1.date&&f2.date?1:f1.title.localeCompare(f2.title)).map(([slug,content])=>createURLEntry(simplifySlug(slug),content)).slice(0,limit??idx.size).join("");return`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
      <title>${escapeHTML(cfg.pageTitle)}</title>
      <link>https://${base}</link>
      <description>${limit?i18n(cfg.locale).pages.rss.lastFewNotes({count:limit}):i18n(cfg.locale).pages.rss.recentNotes} on ${escapeHTML(cfg.pageTitle)}</description>
      <generator>Quartz -- quartz.jzhao.xyz</generator>
      ${items}
    </channel>
  </rss>`}__name(generateRSSFeed,"generateRSSFeed");var ContentIndex=__name(opts=>(opts={...defaultOptions16,...opts},{name:"ContentIndex",async*emit(ctx,content){let cfg=ctx.cfg.configuration,linkIndex=new Map;for(let[tree,file]of content){let slug=file.data.slug,date=getDate(ctx.cfg.configuration,file.data)??new Date;(opts?.includeEmptyFiles||file.data.text&&file.data.text!=="")&&linkIndex.set(slug,{slug,filePath:file.data.relativePath,title:file.data.frontmatter?.title,links:file.data.links??[],tags:file.data.frontmatter?.tags??[],content:file.data.text??"",richContent:opts?.rssFullHtml?escapeHTML(toHtml2(tree,{allowDangerousHtml:!0})):void 0,date,description:file.data.description??""})}opts?.enableSiteMap&&(yield write({ctx,content:generateSiteMap(cfg,linkIndex),slug:"sitemap",ext:".xml"})),opts?.enableRSS&&(yield write({ctx,content:generateRSSFeed(cfg,linkIndex,opts.rssLimit),slug:opts?.rssSlug??"index",ext:".xml"}));let fp=joinSegments("static","contentIndex"),simplifiedIndex=Object.fromEntries(Array.from(linkIndex).map(([slug,content2])=>(delete content2.description,delete content2.date,[slug,content2])));yield write({ctx,content:JSON.stringify(simplifiedIndex),slug:fp,ext:".json"})},externalResources:__name(ctx=>{if(opts?.enableRSS)return{additionalHead:[jsx39("link",{rel:"alternate",type:"application/rss+xml",title:"RSS Feed",href:`https://${ctx.cfg.configuration.baseUrl}/index.xml`})]}},"externalResources")}),"ContentIndex");import path8 from"path";async function*processFile(ctx,file){let ogSlug=simplifySlug(file.data.slug);for(let aliasTarget of file.data.aliases??[]){let aliasTargetSlug=isRelativeURL(aliasTarget)?path8.normalize(path8.join(ogSlug,"..",aliasTarget)):aliasTarget,redirUrl=resolveRelative(aliasTargetSlug,ogSlug);yield write({ctx,content:`
        <!DOCTYPE html>
        <html lang="en-us">
        <head>
        <title>${ogSlug}</title>
        <link rel="canonical" href="${redirUrl}">
        <meta name="robots" content="noindex">
        <meta charset="utf-8">
        <meta http-equiv="refresh" content="0; url=${redirUrl}">
        </head>
        </html>
        `,slug:aliasTargetSlug,ext:".html"})}}__name(processFile,"processFile");var AliasRedirects=__name(()=>({name:"AliasRedirects",async*emit(ctx,content){for(let[_tree,file]of content)yield*processFile(ctx,file)},async*partialEmit(ctx,_content,_resources,changeEvents){for(let changeEvent of changeEvents)changeEvent.file&&(changeEvent.type==="add"||changeEvent.type==="change")&&(yield*processFile(ctx,changeEvent.file))}}),"AliasRedirects");import path10 from"path";import fs3 from"fs";import path9 from"path";import{globby}from"globby";function toPosixPath(fp){return fp.split(path9.sep).join("/")}__name(toPosixPath,"toPosixPath");async function glob(pattern,cwd,ignorePatterns){return(await globby(pattern,{cwd,ignore:ignorePatterns,gitignore:!0})).map(toPosixPath)}__name(glob,"glob");var filesToCopy=__name(async(argv,cfg)=>await glob("**",argv.directory,["**/*.md",...cfg.configuration.ignorePatterns]),"filesToCopy"),copyFile=__name(async(argv,fp)=>{let src=joinSegments(argv.directory,fp),name=slugifyFilePath(fp),dest=joinSegments(argv.output,name),dir=path10.dirname(dest);return await fs3.promises.mkdir(dir,{recursive:!0}),await fs3.promises.copyFile(src,dest),dest},"copyFile"),Assets=__name(()=>({name:"Assets",async*emit({argv,cfg}){let fps=await filesToCopy(argv,cfg);for(let fp of fps)yield copyFile(argv,fp)},async*partialEmit(ctx,_content,_resources,changeEvents){for(let changeEvent of changeEvents)if(path10.extname(changeEvent.path)!==".md"){if(changeEvent.type==="add"||changeEvent.type==="change")yield copyFile(ctx.argv,changeEvent.path);else if(changeEvent.type==="delete"){let name=slugifyFilePath(changeEvent.path),dest=joinSegments(ctx.argv.output,name);await fs3.promises.unlink(dest)}}}}),"Assets");import fs4 from"fs";import{dirname}from"path";var Static=__name(()=>({name:"Static",async*emit({argv,cfg}){let staticPath=joinSegments(QUARTZ,"static"),fps=await glob("**",staticPath,cfg.configuration.ignorePatterns),outputStaticPath=joinSegments(argv.output,"static");await fs4.promises.mkdir(outputStaticPath,{recursive:!0});for(let fp of fps){let src=joinSegments(staticPath,fp),dest=joinSegments(outputStaticPath,fp);await fs4.promises.mkdir(dirname(dest),{recursive:!0}),await fs4.promises.copyFile(src,dest),yield dest}},async*partialEmit(){}}),"Static");import sharp2 from"sharp";var Favicon=__name(()=>({name:"Favicon",async*emit({argv}){let iconPath=joinSegments(QUARTZ,"static","icon.png"),faviconContent=sharp2(iconPath).resize(48,48).toFormat("png");yield write({ctx:{argv},slug:"favicon",ext:".ico",content:faviconContent})},async*partialEmit(){}}),"Favicon");var spa_inline_default='var W=Object.create;var L=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var V=Object.getPrototypeOf,q=Object.prototype.hasOwnProperty;var z=(u,e)=>()=>(e||u((e={exports:{}}).exports,e),e.exports);var K=(u,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let F of I(e))!q.call(u,F)&&F!==t&&L(u,F,{get:()=>e[F],enumerable:!(r=_(e,F))||r.enumerable});return u};var Z=(u,e,t)=>(t=u!=null?W(V(u)):{},K(e||!u||!u.__esModule?L(t,"default",{value:u,enumerable:!0}):t,u));var k=z((gu,U)=>{"use strict";U.exports=eu;function f(u){return u instanceof Buffer?Buffer.from(u):new u.constructor(u.buffer.slice(),u.byteOffset,u.length)}function eu(u){if(u=u||{},u.circles)return tu(u);let e=new Map;if(e.set(Date,n=>new Date(n)),e.set(Map,(n,l)=>new Map(r(Array.from(n),l))),e.set(Set,(n,l)=>new Set(r(Array.from(n),l))),u.constructorHandlers)for(let n of u.constructorHandlers)e.set(n[0],n[1]);let t=null;return u.proto?o:F;function r(n,l){let D=Object.keys(n),i=new Array(D.length);for(let a=0;a<D.length;a++){let s=D[a],c=n[s];typeof c!="object"||c===null?i[s]=c:c.constructor!==Object&&(t=e.get(c.constructor))?i[s]=t(c,l):ArrayBuffer.isView(c)?i[s]=f(c):i[s]=l(c)}return i}function F(n){if(typeof n!="object"||n===null)return n;if(Array.isArray(n))return r(n,F);if(n.constructor!==Object&&(t=e.get(n.constructor)))return t(n,F);let l={};for(let D in n){if(Object.hasOwnProperty.call(n,D)===!1)continue;let i=n[D];typeof i!="object"||i===null?l[D]=i:i.constructor!==Object&&(t=e.get(i.constructor))?l[D]=t(i,F):ArrayBuffer.isView(i)?l[D]=f(i):l[D]=F(i)}return l}function o(n){if(typeof n!="object"||n===null)return n;if(Array.isArray(n))return r(n,o);if(n.constructor!==Object&&(t=e.get(n.constructor)))return t(n,o);let l={};for(let D in n){let i=n[D];typeof i!="object"||i===null?l[D]=i:i.constructor!==Object&&(t=e.get(i.constructor))?l[D]=t(i,o):ArrayBuffer.isView(i)?l[D]=f(i):l[D]=o(i)}return l}}function tu(u){let e=[],t=[],r=new Map;if(r.set(Date,D=>new Date(D)),r.set(Map,(D,i)=>new Map(o(Array.from(D),i))),r.set(Set,(D,i)=>new Set(o(Array.from(D),i))),u.constructorHandlers)for(let D of u.constructorHandlers)r.set(D[0],D[1]);let F=null;return u.proto?l:n;function o(D,i){let a=Object.keys(D),s=new Array(a.length);for(let c=0;c<a.length;c++){let A=a[c],E=D[A];if(typeof E!="object"||E===null)s[A]=E;else if(E.constructor!==Object&&(F=r.get(E.constructor)))s[A]=F(E,i);else if(ArrayBuffer.isView(E))s[A]=f(E);else{let R=e.indexOf(E);R!==-1?s[A]=t[R]:s[A]=i(E)}}return s}function n(D){if(typeof D!="object"||D===null)return D;if(Array.isArray(D))return o(D,n);if(D.constructor!==Object&&(F=r.get(D.constructor)))return F(D,n);let i={};e.push(D),t.push(i);for(let a in D){if(Object.hasOwnProperty.call(D,a)===!1)continue;let s=D[a];if(typeof s!="object"||s===null)i[a]=s;else if(s.constructor!==Object&&(F=r.get(s.constructor)))i[a]=F(s,n);else if(ArrayBuffer.isView(s))i[a]=f(s);else{let c=e.indexOf(s);c!==-1?i[a]=t[c]:i[a]=n(s)}}return e.pop(),t.pop(),i}function l(D){if(typeof D!="object"||D===null)return D;if(Array.isArray(D))return o(D,l);if(D.constructor!==Object&&(F=r.get(D.constructor)))return F(D,l);let i={};e.push(D),t.push(i);for(let a in D){let s=D[a];if(typeof s!="object"||s===null)i[a]=s;else if(s.constructor!==Object&&(F=r.get(s.constructor)))i[a]=F(s,l);else if(ArrayBuffer.isView(s))i[a]=f(s);else{let c=e.indexOf(s);c!==-1?i[a]=t[c]:i[a]=l(s)}}return e.pop(),t.pop(),i}}});var y=u=>(e,t)=>e[`node${u}`]===t[`node${u}`],Q=y("Name"),Y=y("Type"),G=y("Value");function T(u,e){if(u.attributes.length===0&&e.attributes.length===0)return[];let t=[],r=new Map,F=new Map;for(let o of u.attributes)r.set(o.name,o.value);for(let o of e.attributes){let n=r.get(o.name);o.value===n?r.delete(o.name):(typeof n<"u"&&r.delete(o.name),F.set(o.name,o.value))}for(let o of r.keys())t.push({type:5,name:o});for(let[o,n]of F.entries())t.push({type:4,name:o,value:n});return t}function m(u,e=!0){let t=`${u.localName}`;for(let{name:r,value:F}of u.attributes)e&&r.startsWith("data-")||(t+=`[${r}=${F}]`);return t+=u.innerHTML,t}function g(u){switch(u.tagName){case"BASE":case"TITLE":return u.localName;case"META":{if(u.hasAttribute("name"))return`meta[name="${u.getAttribute("name")}"]`;if(u.hasAttribute("property"))return`meta[name="${u.getAttribute("property")}"]`;break}case"LINK":{if(u.hasAttribute("rel")&&u.hasAttribute("href"))return`link[rel="${u.getAttribute("rel")}"][href="${u.getAttribute("href")}"]`;if(u.hasAttribute("href"))return`link[href="${u.getAttribute("href")}"]`;break}}return m(u)}function J(u){let[e,t=""]=u.split("?");return`${e}?t=${Date.now()}&${t.replace(/t=\\d+/g,"")}`}function C(u){if(u.nodeType===1&&u.hasAttribute("data-persist"))return u;if(u.nodeType===1&&u.localName==="script"){let e=document.createElement("script");for(let{name:t,value:r}of u.attributes)t==="src"&&(r=J(r)),e.setAttribute(t,r);return e.innerHTML=u.innerHTML,e}return u.cloneNode(!0)}function X(u,e){if(u.children.length===0&&e.children.length===0)return[];let t=[],r=new Map,F=new Map,o=new Map;for(let n of u.children)r.set(g(n),n);for(let n of e.children){let l=g(n),D=r.get(l);D?m(n,!1)!==m(D,!1)&&F.set(l,C(n)):o.set(l,C(n)),r.delete(l)}for(let n of u.childNodes){if(n.nodeType===1){let l=g(n);if(r.has(l)){t.push({type:1});continue}else if(F.has(l)){let D=F.get(l);t.push({type:3,attributes:T(n,D),children:j(n,D)});continue}}t.push(void 0)}for(let n of o.values())t.push({type:0,node:C(n)});return t}function j(u,e){let t=[],r=Math.max(u.childNodes.length,e.childNodes.length);for(let F=0;F<r;F++){let o=u.childNodes.item(F),n=e.childNodes.item(F);t[F]=p(o,n)}return t}function p(u,e){if(!u)return{type:0,node:C(e)};if(!e)return{type:1};if(Y(u,e)){if(u.nodeType===3){let t=u.nodeValue,r=e.nodeValue;if(t.trim().length===0&&r.trim().length===0)return}if(u.nodeType===1){if(Q(u,e)){let t=u.tagName==="HEAD"?X:j;return{type:3,attributes:T(u,e),children:t(u,e)}}return{type:2,node:C(e)}}else return u.nodeType===9?p(u.documentElement,e.documentElement):G(u,e)?void 0:{type:2,value:e.nodeValue}}return{type:2,node:C(e)}}function uu(u,e){if(e.length!==0)for(let{type:t,name:r,value:F}of e)t===5?u.removeAttribute(r):t===4&&u.setAttribute(r,F)}async function w(u,e,t){if(!e)return;let r;switch(u.nodeType===9?(u=u.documentElement,r=u):t?r=t:r=u,e.type){case 0:{let{node:F}=e;u.appendChild(F);return}case 1:{if(!r)return;u.removeChild(r);return}case 2:{if(!r)return;let{node:F,value:o}=e;if(typeof o=="string"){r.nodeValue=o;return}r.replaceWith(F);return}case 3:{if(!r)return;let{attributes:F,children:o}=e;uu(r,F);let n=Array.from(r.childNodes);await Promise.all(o.map((l,D)=>w(r,l,n[D])));return}}}function b(u,e){let t=p(u,e);return w(u,t)}var Bu=Object.hasOwnProperty;var O=Z(k(),1),Du=(0,O.default)();function v(u){return u.document.body.dataset.slug}var M=(u,e,t)=>{let r=new URL(u.getAttribute(e),t);u.setAttribute(e,r.pathname+r.hash)};function N(u,e){u.querySelectorAll(\'[href=""], [href^="./"], [href^="../"]\').forEach(t=>M(t,"href",e)),u.querySelectorAll(\'[src=""], [src^="./"], [src^="../"]\').forEach(t=>M(t,"src",e))}var nu=/<link rel="canonical" href="([^"]*)">/;async function P(u){let e=await fetch(`${u}`);if(!e.headers.get("content-type")?.startsWith("text/html"))return e;let t=await e.clone().text(),[r,F]=t.match(nu)??[];return F?fetch(`${new URL(F,u)}`):e}var ru=1,d=document.createElement("route-announcer"),Fu=u=>u?.nodeType===ru,iu=u=>{try{let e=new URL(u);if(window.location.origin===e.origin)return!0}catch{}return!1},ou=u=>{let e=u.origin===window.location.origin,t=u.pathname===window.location.pathname;return e&&t},H=({target:u})=>{if(!Fu(u)||u.attributes.getNamedItem("target")?.value==="_blank")return;let e=u.closest("a");if(!e||"routerIgnore"in e.dataset)return;let{href:t}=e;if(iu(t))return{url:new URL(t),scroll:"routerNoscroll"in e.dataset?!1:void 0}};function $(u){let e=new CustomEvent("nav",{detail:{url:u}});document.dispatchEvent(e)}var S=new Set;window.addCleanup=u=>S.add(u);function lu(){let u=document.createElement("div");u.className="navigation-progress",u.style.width="0",document.body.contains(u)||document.body.appendChild(u),setTimeout(()=>{u.style.width="80%"},100)}var B=!1,x;async function su(u,e=!1){B=!0,lu(),x=x||new DOMParser;let t=await P(u).then(D=>{if(D.headers.get("content-type")?.startsWith("text/html"))return D.text();window.location.assign(u)}).catch(()=>{window.location.assign(u)});if(!t)return;let r=new CustomEvent("prenav",{detail:{}});document.dispatchEvent(r),S.forEach(D=>D()),S.clear();let F=x.parseFromString(t,"text/html");N(F,u);let o=F.querySelector("title")?.textContent;if(o)document.title=o;else{let D=document.querySelector("h1");o=D?.innerText??D?.textContent??u.pathname}d.textContent!==o&&(d.textContent=o),d.dataset.persist="",F.body.appendChild(d),await b(document.body,F.body),e||(u.hash?document.getElementById(decodeURIComponent(u.hash.substring(1)))?.scrollIntoView():window.scrollTo({top:0})),document.head.querySelectorAll(":not([data-persist])").forEach(D=>D.remove()),F.head.querySelectorAll(":not([data-persist])").forEach(D=>document.head.appendChild(D)),e||history.pushState({},"",u),$(v(window)),delete d.dataset.persist}async function h(u,e=!1){if(!B){B=!0;try{await su(u,e)}catch(t){console.error(t),window.location.assign(u)}finally{B=!1}}}window.spaNavigate=h;function au(){return typeof window<"u"&&(window.addEventListener("click",async u=>{let{url:e}=H(u)??{};if(!(!e||u.ctrlKey||u.metaKey)){if(u.preventDefault(),ou(e)&&e.hash){document.getElementById(decodeURIComponent(e.hash.substring(1)))?.scrollIntoView(),history.pushState({},"",e);return}h(e,!1)}}),window.addEventListener("popstate",u=>{let{url:e}=H(u)??{};window.location.hash&&window.location.pathname===e?.pathname||h(new URL(window.location.toString()),!0)})),new class{go(e){let t=new URL(e,window.location.toString());return h(t,!1)}back(){return window.history.back()}forward(){return window.history.forward()}}}au();$(v(window));if(!customElements.get("route-announcer")){let u={"aria-live":"assertive","aria-atomic":"true",style:"position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"};customElements.define("route-announcer",class extends HTMLElement{constructor(){super()}connectedCallback(){for(let[t,r]of Object.entries(u))this.setAttribute(t,r)}})}\n';var popover_inline_default='var ce=Object.create;var wt=Object.defineProperty;var le=Object.getOwnPropertyDescriptor;var ae=Object.getOwnPropertyNames;var De=Object.getPrototypeOf,fe=Object.prototype.hasOwnProperty;var Fe=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var de=(t,e,n,u)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of ae(e))!fe.call(t,o)&&o!==n&&wt(t,o,{get:()=>e[o],enumerable:!(u=le(e,o))||u.enumerable});return t};var me=(t,e,n)=>(n=t!=null?ce(De(t)):{},de(e||!t||!t.__esModule?wt(n,"default",{value:t,enumerable:!0}):n,t));var ee=Fe((mn,te)=>{"use strict";te.exports=$e;function Z(t){return t instanceof Buffer?Buffer.from(t):new t.constructor(t.buffer.slice(),t.byteOffset,t.length)}function $e(t){if(t=t||{},t.circles)return Ne(t);let e=new Map;if(e.set(Date,i=>new Date(i)),e.set(Map,(i,l)=>new Map(u(Array.from(i),l))),e.set(Set,(i,l)=>new Set(u(Array.from(i),l))),t.constructorHandlers)for(let i of t.constructorHandlers)e.set(i[0],i[1]);let n=null;return t.proto?r:o;function u(i,l){let s=Object.keys(i),c=new Array(s.length);for(let D=0;D<s.length;D++){let a=s[D],f=i[a];typeof f!="object"||f===null?c[a]=f:f.constructor!==Object&&(n=e.get(f.constructor))?c[a]=n(f,l):ArrayBuffer.isView(f)?c[a]=Z(f):c[a]=l(f)}return c}function o(i){if(typeof i!="object"||i===null)return i;if(Array.isArray(i))return u(i,o);if(i.constructor!==Object&&(n=e.get(i.constructor)))return n(i,o);let l={};for(let s in i){if(Object.hasOwnProperty.call(i,s)===!1)continue;let c=i[s];typeof c!="object"||c===null?l[s]=c:c.constructor!==Object&&(n=e.get(c.constructor))?l[s]=n(c,o):ArrayBuffer.isView(c)?l[s]=Z(c):l[s]=o(c)}return l}function r(i){if(typeof i!="object"||i===null)return i;if(Array.isArray(i))return u(i,r);if(i.constructor!==Object&&(n=e.get(i.constructor)))return n(i,r);let l={};for(let s in i){let c=i[s];typeof c!="object"||c===null?l[s]=c:c.constructor!==Object&&(n=e.get(c.constructor))?l[s]=n(c,r):ArrayBuffer.isView(c)?l[s]=Z(c):l[s]=r(c)}return l}}function Ne(t){let e=[],n=[],u=new Map;if(u.set(Date,s=>new Date(s)),u.set(Map,(s,c)=>new Map(r(Array.from(s),c))),u.set(Set,(s,c)=>new Set(r(Array.from(s),c))),t.constructorHandlers)for(let s of t.constructorHandlers)u.set(s[0],s[1]);let o=null;return t.proto?l:i;function r(s,c){let D=Object.keys(s),a=new Array(D.length);for(let f=0;f<D.length;f++){let F=D[f],d=s[F];if(typeof d!="object"||d===null)a[F]=d;else if(d.constructor!==Object&&(o=u.get(d.constructor)))a[F]=o(d,c);else if(ArrayBuffer.isView(d))a[F]=Z(d);else{let m=e.indexOf(d);m!==-1?a[F]=n[m]:a[F]=c(d)}}return a}function i(s){if(typeof s!="object"||s===null)return s;if(Array.isArray(s))return r(s,i);if(s.constructor!==Object&&(o=u.get(s.constructor)))return o(s,i);let c={};e.push(s),n.push(c);for(let D in s){if(Object.hasOwnProperty.call(s,D)===!1)continue;let a=s[D];if(typeof a!="object"||a===null)c[D]=a;else if(a.constructor!==Object&&(o=u.get(a.constructor)))c[D]=o(a,i);else if(ArrayBuffer.isView(a))c[D]=Z(a);else{let f=e.indexOf(a);f!==-1?c[D]=n[f]:c[D]=i(a)}}return e.pop(),n.pop(),c}function l(s){if(typeof s!="object"||s===null)return s;if(Array.isArray(s))return r(s,l);if(s.constructor!==Object&&(o=u.get(s.constructor)))return o(s,l);let c={};e.push(s),n.push(c);for(let D in s){let a=s[D];if(typeof a!="object"||a===null)c[D]=a;else if(a.constructor!==Object&&(o=u.get(a.constructor)))c[D]=o(a,l);else if(ArrayBuffer.isView(a))c[D]=Z(a);else{let f=e.indexOf(a);f!==-1?c[D]=n[f]:c[D]=l(a)}}return e.pop(),n.pop(),c}}});var N=Math.min,R=Math.max,tt=Math.round;var S=t=>({x:t,y:t}),ge={left:"right",right:"left",bottom:"top",top:"bottom"};function dt(t,e,n){return R(t,N(e,n))}function et(t,e){return typeof t=="function"?t(e):t}function k(t){return t.split("-")[0]}function st(t){return t.split("-")[1]}function mt(t){return t==="x"?"y":"x"}function gt(t){return t==="y"?"height":"width"}function M(t){let e=t[0];return e==="t"||e==="b"?"y":"x"}function ht(t){return mt(M(t))}function vt(t,e,n){n===void 0&&(n=!1);let u=st(t),o=ht(t),r=gt(o),i=o==="x"?u===(n?"end":"start")?"right":"left":u==="start"?"bottom":"top";return e.reference[r]>e.floating[r]&&(i=J(i)),[i,J(i)]}function bt(t){let e=J(t);return[rt(t),e,rt(e)]}function rt(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}var Bt=["left","right"],yt=["right","left"],he=["top","bottom"],pe=["bottom","top"];function Ae(t,e,n){switch(t){case"top":case"bottom":return n?e?yt:Bt:e?Bt:yt;case"left":case"right":return e?he:pe;default:return[]}}function Rt(t,e,n,u){let o=st(t),r=Ae(k(t),n==="start",u);return o&&(r=r.map(i=>i+"-"+o),e&&(r=r.concat(r.map(rt)))),r}function J(t){let e=k(t);return ge[e]+t.slice(e.length)}function Ee(t){return{top:0,right:0,bottom:0,left:0,...t}}function pt(t){return typeof t!="number"?Ee(t):{top:t,right:t,bottom:t,left:t}}function H(t){let{x:e,y:n,width:u,height:o}=t;return{width:u,height:o,top:n,left:e,right:e+u,bottom:n+o,x:e,y:n}}function St(t,e,n){let{reference:u,floating:o}=t,r=M(e),i=ht(e),l=gt(i),s=k(e),c=r==="y",D=u.x+u.width/2-o.width/2,a=u.y+u.height/2-o.height/2,f=u[l]/2-o[l]/2,F;switch(s){case"top":F={x:D,y:u.y-o.height};break;case"bottom":F={x:D,y:u.y+u.height};break;case"right":F={x:u.x+u.width,y:a};break;case"left":F={x:u.x-o.width,y:a};break;default:F={x:u.x,y:u.y}}switch(st(e)){case"start":F[i]-=f*(n&&c?-1:1);break;case"end":F[i]+=f*(n&&c?-1:1);break}return F}async function Ot(t,e){var n;e===void 0&&(e={});let{x:u,y:o,platform:r,rects:i,elements:l,strategy:s}=t,{boundary:c="clippingAncestors",rootBoundary:D="viewport",elementContext:a="floating",altBoundary:f=!1,padding:F=0}=et(e,t),d=pt(F),g=l[f?a==="floating"?"reference":"floating":a],h=H(await r.getClippingRect({element:(n=await(r.isElement==null?void 0:r.isElement(g)))==null||n?g:g.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(l.floating)),boundary:c,rootBoundary:D,strategy:s})),A=a==="floating"?{x:u,y:o,width:i.floating.width,height:i.floating.height}:i.reference,p=await(r.getOffsetParent==null?void 0:r.getOffsetParent(l.floating)),E=await(r.isElement==null?void 0:r.isElement(p))?await(r.getScale==null?void 0:r.getScale(p))||{x:1,y:1}:{x:1,y:1},y=H(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:A,offsetParent:p,strategy:s}):A);return{top:(h.top-y.top+d.top)/E.y,bottom:(y.bottom-h.bottom+d.bottom)/E.y,left:(h.left-y.left+d.left)/E.x,right:(y.right-h.right+d.right)/E.x}}var Ce=50,Lt=async(t,e,n)=>{let{placement:u="bottom",strategy:o="absolute",middleware:r=[],platform:i}=n,l=i.detectOverflow?i:{...i,detectOverflow:Ot},s=await(i.isRTL==null?void 0:i.isRTL(e)),c=await i.getElementRects({reference:t,floating:e,strategy:o}),{x:D,y:a}=St(c,u,s),f=u,F=0,d={};for(let m=0;m<r.length;m++){let g=r[m];if(!g)continue;let{name:h,fn:A}=g,{x:p,y:E,data:y,reset:x}=await A({x:D,y:a,initialPlacement:u,placement:f,strategy:o,middlewareData:d,rects:c,platform:l,elements:{reference:t,floating:e}});D=p??D,a=E??a,d[h]={...d[h],...y},x&&F<Ce&&(F++,typeof x=="object"&&(x.placement&&(f=x.placement),x.rects&&(c=x.rects===!0?await i.getElementRects({reference:t,floating:e,strategy:o}):x.rects),{x:D,y:a}=St(c,f,s)),m=-1)}return{x:D,y:a,placement:f,strategy:o,middlewareData:d}};var Pt=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var n,u;let{placement:o,middlewareData:r,rects:i,initialPlacement:l,platform:s,elements:c}=e,{mainAxis:D=!0,crossAxis:a=!0,fallbackPlacements:f,fallbackStrategy:F="bestFit",fallbackAxisSideDirection:d="none",flipAlignment:m=!0,...g}=et(t,e);if((n=r.arrow)!=null&&n.alignmentOffset)return{};let h=k(o),A=M(l),p=k(l)===l,E=await(s.isRTL==null?void 0:s.isRTL(c.floating)),y=f||(p||!m?[J(l)]:bt(l)),x=d!=="none";!f&&x&&y.push(...Rt(l,m,d,E));let it=[l,...y],Q=await s.detectOverflow(e,g),I=[],C=((u=r.flip)==null?void 0:u.overflows)||[];if(D&&I.push(Q[h]),a){let O=vt(o,i,E);I.push(Q[O[0]],Q[O[1]])}if(C=[...C,{placement:o,overflows:I}],!I.every(O=>O<=0)){var X,G;let O=(((X=r.flip)==null?void 0:X.index)||0)+1,U=it[O];if(U&&(!(a==="alignment"?A!==M(U):!1)||C.every(B=>M(B.placement)===A?B.overflows[0]>0:!0)))return{data:{index:O,overflows:C},reset:{placement:U}};let j=(G=C.filter(T=>T.overflows[0]<=0).sort((T,B)=>T.overflows[1]-B.overflows[1])[0])==null?void 0:G.placement;if(!j)switch(F){case"bestFit":{var q;let T=(q=C.filter(B=>{if(x){let $=M(B.placement);return $===A||$==="y"}return!0}).map(B=>[B.placement,B.overflows.filter($=>$>0).reduce(($,se)=>$+se,0)]).sort((B,$)=>B[1]-$[1])[0])==null?void 0:q[0];T&&(j=T);break}case"initialPlacement":j=l;break}if(o!==j)return{reset:{placement:j}}}return{}}}};function Tt(t){let e=N(...t.map(r=>r.left)),n=N(...t.map(r=>r.top)),u=R(...t.map(r=>r.right)),o=R(...t.map(r=>r.bottom));return{x:e,y:n,width:u-e,height:o-n}}function xe(t){let e=t.slice().sort((o,r)=>o.y-r.y),n=[],u=null;for(let o=0;o<e.length;o++){let r=e[o];!u||r.y-u.y>u.height/2?n.push([r]):n[n.length-1].push(r),u=r}return n.map(o=>H(Tt(o)))}var kt=function(t){return t===void 0&&(t={}),{name:"inline",options:t,async fn(e){let{placement:n,elements:u,rects:o,platform:r,strategy:i}=e,{padding:l=2,x:s,y:c}=et(t,e),D=Array.from(await(r.getClientRects==null?void 0:r.getClientRects(u.reference))||[]),a=xe(D),f=H(Tt(D)),F=pt(l);function d(){if(a.length===2&&a[0].left>a[1].right&&s!=null&&c!=null)return a.find(g=>s>g.left-F.left&&s<g.right+F.right&&c>g.top-F.top&&c<g.bottom+F.bottom)||f;if(a.length>=2){if(M(n)==="y"){let C=a[0],X=a[a.length-1],G=k(n)==="top",q=C.top,O=X.bottom,U=G?C.left:X.left,j=G?C.right:X.right,T=j-U,B=O-q;return{top:q,bottom:O,left:U,right:j,width:T,height:B,x:U,y:q}}let g=k(n)==="left",h=R(...a.map(C=>C.right)),A=N(...a.map(C=>C.left)),p=a.filter(C=>g?C.left===A:C.right===h),E=p[0].top,y=p[p.length-1].bottom,x=A,it=h,Q=it-x,I=y-E;return{top:E,bottom:y,left:x,right:it,width:Q,height:I,x,y:E}}return f}let m=await r.getElementRects({reference:{getBoundingClientRect:d},floating:u.floating,strategy:i});return o.reference.x!==m.reference.x||o.reference.y!==m.reference.y||o.reference.width!==m.reference.width||o.reference.height!==m.reference.height?{reset:{rects:m}}:{}}}};var Mt=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){let{x:n,y:u,placement:o,platform:r}=e,{mainAxis:i=!0,crossAxis:l=!1,limiter:s={fn:h=>{let{x:A,y:p}=h;return{x:A,y:p}}},...c}=et(t,e),D={x:n,y:u},a=await r.detectOverflow(e,c),f=M(k(o)),F=mt(f),d=D[F],m=D[f];if(i){let h=F==="y"?"top":"left",A=F==="y"?"bottom":"right",p=d+a[h],E=d-a[A];d=dt(p,d,E)}if(l){let h=f==="y"?"top":"left",A=f==="y"?"bottom":"right",p=m+a[h],E=m-a[A];m=dt(p,m,E)}let g=s.fn({...e,[F]:d,[f]:m});return{...g,data:{x:g.x-n,y:g.y-u,enabled:{[F]:i,[f]:l}}}}}};function lt(){return typeof window<"u"}function V(t){return Wt(t)?(t.nodeName||"").toLowerCase():"#document"}function w(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function L(t){var e;return(e=(Wt(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Wt(t){return lt()?t instanceof Node||t instanceof w(t).Node:!1}function v(t){return lt()?t instanceof Element||t instanceof w(t).Element:!1}function P(t){return lt()?t instanceof HTMLElement||t instanceof w(t).HTMLElement:!1}function Ht(t){return!lt()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof w(t).ShadowRoot}function Y(t){let{overflow:e,overflowX:n,overflowY:u,display:o}=b(t);return/auto|scroll|overlay|hidden|clip/.test(e+u+n)&&o!=="inline"&&o!=="contents"}function jt(t){return/^(table|td|th)$/.test(V(t))}function nt(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}var we=/transform|translate|scale|rotate|perspective|filter/,Be=/paint|layout|strict|content/,_=t=>!!t&&t!=="none",At;function at(t){let e=v(t)?b(t):t;return _(e.transform)||_(e.translate)||_(e.scale)||_(e.rotate)||_(e.perspective)||!Dt()&&(_(e.backdropFilter)||_(e.filter))||we.test(e.willChange||"")||Be.test(e.contain||"")}function $t(t){let e=W(t);for(;P(e)&&!z(e);){if(at(e))return e;if(nt(e))return null;e=W(e)}return null}function Dt(){return At==null&&(At=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),At}function z(t){return/^(html|body|#document)$/.test(V(t))}function b(t){return w(t).getComputedStyle(t)}function ut(t){return v(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function W(t){if(V(t)==="html")return t;let e=t.assignedSlot||t.parentNode||Ht(t)&&t.host||L(t);return Ht(e)?e.host:e}function Nt(t){let e=W(t);return z(e)?t.ownerDocument?t.ownerDocument.body:t.body:P(e)&&Y(e)?e:Nt(e)}function ct(t,e,n){var u;e===void 0&&(e=[]),n===void 0&&(n=!0);let o=Nt(t),r=o===((u=t.ownerDocument)==null?void 0:u.body),i=w(o);if(r){let l=ft(i);return e.concat(i,i.visualViewport||[],Y(o)?o:[],l&&n?ct(l):[])}else return e.concat(o,ct(o,[],n))}function ft(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function zt(t){let e=b(t),n=parseFloat(e.width)||0,u=parseFloat(e.height)||0,o=P(t),r=o?t.offsetWidth:n,i=o?t.offsetHeight:u,l=tt(n)!==r||tt(u)!==i;return l&&(n=r,u=i),{width:n,height:u,$:l}}function It(t){return v(t)?t:t.contextElement}function K(t){let e=It(t);if(!P(e))return S(1);let n=e.getBoundingClientRect(),{width:u,height:o,$:r}=zt(e),i=(r?tt(n.width):n.width)/u,l=(r?tt(n.height):n.height)/o;return(!i||!Number.isFinite(i))&&(i=1),(!l||!Number.isFinite(l))&&(l=1),{x:i,y:l}}var ye=S(0);function Xt(t){let e=w(t);return!Dt()||!e.visualViewport?ye:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function ve(t,e,n){return e===void 0&&(e=!1),!n||e&&n!==w(t)?!1:e}function ot(t,e,n,u){e===void 0&&(e=!1),n===void 0&&(n=!1);let o=t.getBoundingClientRect(),r=It(t),i=S(1);e&&(u?v(u)&&(i=K(u)):i=K(t));let l=ve(r,n,u)?Xt(r):S(0),s=(o.left+l.x)/i.x,c=(o.top+l.y)/i.y,D=o.width/i.x,a=o.height/i.y;if(r){let f=w(r),F=u&&v(u)?w(u):u,d=f,m=ft(d);for(;m&&u&&F!==d;){let g=K(m),h=m.getBoundingClientRect(),A=b(m),p=h.left+(m.clientLeft+parseFloat(A.paddingLeft))*g.x,E=h.top+(m.clientTop+parseFloat(A.paddingTop))*g.y;s*=g.x,c*=g.y,D*=g.x,a*=g.y,s+=p,c+=E,d=w(m),m=ft(d)}}return H({width:D,height:a,x:s,y:c})}function Ft(t,e){let n=ut(t).scrollLeft;return e?e.left+n:ot(L(t)).left+n}function qt(t,e){let n=t.getBoundingClientRect(),u=n.left+e.scrollLeft-Ft(t,n),o=n.top+e.scrollTop;return{x:u,y:o}}function be(t){let{elements:e,rect:n,offsetParent:u,strategy:o}=t,r=o==="fixed",i=L(u),l=e?nt(e.floating):!1;if(u===i||l&&r)return n;let s={scrollLeft:0,scrollTop:0},c=S(1),D=S(0),a=P(u);if((a||!a&&!r)&&((V(u)!=="body"||Y(i))&&(s=ut(u)),a)){let F=ot(u);c=K(u),D.x=F.x+u.clientLeft,D.y=F.y+u.clientTop}let f=i&&!a&&!r?qt(i,s):S(0);return{width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-s.scrollLeft*c.x+D.x+f.x,y:n.y*c.y-s.scrollTop*c.y+D.y+f.y}}function Re(t){return Array.from(t.getClientRects())}function Se(t){let e=L(t),n=ut(t),u=t.ownerDocument.body,o=R(e.scrollWidth,e.clientWidth,u.scrollWidth,u.clientWidth),r=R(e.scrollHeight,e.clientHeight,u.scrollHeight,u.clientHeight),i=-n.scrollLeft+Ft(t),l=-n.scrollTop;return b(u).direction==="rtl"&&(i+=R(e.clientWidth,u.clientWidth)-o),{width:o,height:r,x:i,y:l}}var Ut=25;function Oe(t,e){let n=w(t),u=L(t),o=n.visualViewport,r=u.clientWidth,i=u.clientHeight,l=0,s=0;if(o){r=o.width,i=o.height;let D=Dt();(!D||D&&e==="fixed")&&(l=o.offsetLeft,s=o.offsetTop)}let c=Ft(u);if(c<=0){let D=u.ownerDocument,a=D.body,f=getComputedStyle(a),F=D.compatMode==="CSS1Compat"&&parseFloat(f.marginLeft)+parseFloat(f.marginRight)||0,d=Math.abs(u.clientWidth-a.clientWidth-F);d<=Ut&&(r-=d)}else c<=Ut&&(r+=c);return{width:r,height:i,x:l,y:s}}function Le(t,e){let n=ot(t,!0,e==="fixed"),u=n.top+t.clientTop,o=n.left+t.clientLeft,r=P(t)?K(t):S(1),i=t.clientWidth*r.x,l=t.clientHeight*r.y,s=o*r.x,c=u*r.y;return{width:i,height:l,x:s,y:c}}function _t(t,e,n){let u;if(e==="viewport")u=Oe(t,n);else if(e==="document")u=Se(L(t));else if(v(e))u=Le(e,n);else{let o=Xt(t);u={x:e.x-o.x,y:e.y-o.y,width:e.width,height:e.height}}return H(u)}function Yt(t,e){let n=W(t);return n===e||!v(n)||z(n)?!1:b(n).position==="fixed"||Yt(n,e)}function Pe(t,e){let n=e.get(t);if(n)return n;let u=ct(t,[],!1).filter(l=>v(l)&&V(l)!=="body"),o=null,r=b(t).position==="fixed",i=r?W(t):t;for(;v(i)&&!z(i);){let l=b(i),s=at(i);!s&&l.position==="fixed"&&(o=null),(r?!s&&!o:!s&&l.position==="static"&&!!o&&(o.position==="absolute"||o.position==="fixed")||Y(i)&&!s&&Yt(t,i))?u=u.filter(D=>D!==i):o=l,i=W(i)}return e.set(t,u),u}function Te(t){let{element:e,boundary:n,rootBoundary:u,strategy:o}=t,i=[...n==="clippingAncestors"?nt(e)?[]:Pe(e,this._c):[].concat(n),u],l=_t(e,i[0],o),s=l.top,c=l.right,D=l.bottom,a=l.left;for(let f=1;f<i.length;f++){let F=_t(e,i[f],o);s=R(F.top,s),c=N(F.right,c),D=N(F.bottom,D),a=R(F.left,a)}return{width:c-a,height:D-s,x:a,y:s}}function ke(t){let{width:e,height:n}=zt(t);return{width:e,height:n}}function Me(t,e,n){let u=P(e),o=L(e),r=n==="fixed",i=ot(t,!0,r,e),l={scrollLeft:0,scrollTop:0},s=S(0);function c(){s.x=Ft(o)}if(u||!u&&!r)if((V(e)!=="body"||Y(o))&&(l=ut(e)),u){let F=ot(e,!0,r,e);s.x=F.x+e.clientLeft,s.y=F.y+e.clientTop}else o&&c();r&&!u&&o&&c();let D=o&&!u&&!r?qt(o,l):S(0),a=i.left+l.scrollLeft-s.x-D.x,f=i.top+l.scrollTop-s.y-D.y;return{x:a,y:f,width:i.width,height:i.height}}function Et(t){return b(t).position==="static"}function Vt(t,e){if(!P(t)||b(t).position==="fixed")return null;if(e)return e(t);let n=t.offsetParent;return L(t)===n&&(n=n.ownerDocument.body),n}function Kt(t,e){let n=w(t);if(nt(t))return n;if(!P(t)){let o=W(t);for(;o&&!z(o);){if(v(o)&&!Et(o))return o;o=W(o)}return n}let u=Vt(t,e);for(;u&&jt(u)&&Et(u);)u=Vt(u,e);return u&&z(u)&&Et(u)&&!at(u)?n:u||$t(t)||n}var He=async function(t){let e=this.getOffsetParent||Kt,n=this.getDimensions,u=await n(t.floating);return{reference:Me(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:u.width,height:u.height}}};function We(t){return b(t).direction==="rtl"}var je={convertOffsetParentRelativeRectToViewportRelativeRect:be,getDocumentElement:L,getClippingRect:Te,getOffsetParent:Kt,getElementRects:He,getClientRects:Re,getDimensions:ke,getScale:K,isElement:v,isRTL:We};var Zt=Mt,Qt=Pt;var Gt=kt;var Jt=(t,e,n)=>{let u=new Map,o={platform:je,...n},r={...o.platform,_c:u};return Lt(t,e,{...o,platform:r})};var Fn=Object.hasOwnProperty;var ne=me(ee(),1),Ue=(0,ne.default)();var ue=(t,e,n)=>{let u=new URL(t.getAttribute(e),n);t.setAttribute(e,u.pathname+u.hash)};function oe(t,e){t.querySelectorAll(\'[href=""], [href^="./"], [href^="../"]\').forEach(n=>ue(n,"href",e)),t.querySelectorAll(\'[src=""], [src^="./"], [src^="../"]\').forEach(n=>ue(n,"src",e))}var _e=/<link rel="canonical" href="([^"]*)">/;async function ie(t){let e=await fetch(`${t}`);if(!e.headers.get("content-type")?.startsWith("text/html"))return e;let n=await e.clone().text(),[u,o]=n.match(_e)??[];return o?fetch(`${new URL(o,t)}`):e}var Ve=new DOMParser,Ct=null;async function re({clientX:t,clientY:e}){let n=Ct=this;if(n.dataset.noPopover==="true")return;async function u(m){let{x:g,y:h}=await Jt(n,m,{strategy:"fixed",middleware:[Gt({x:t,y:e}),Zt(),Qt()]});Object.assign(m.style,{transform:`translate(${g.toFixed()}px, ${h.toFixed()}px)`})}function o(m){if(xt(),m.classList.add("active-popover"),u(m),i!==""){let g=`#popover-internal-${i.slice(1)}`,h=d.querySelector(g);h&&d.scroll({top:h.offsetTop-12,behavior:"instant"})}}let r=new URL(n.href),i=decodeURIComponent(r.hash);r.hash="",r.search="";let l=`popover-${n.pathname}`,s=document.getElementById(l);if(document.getElementById(l)){o(s);return}let c=await ie(r).catch(m=>{console.error(m)});if(!c)return;let[D]=c.headers.get("Content-Type").split(";"),[a,f]=D.split("/"),F=document.createElement("div");F.id=l,F.classList.add("popover");let d=document.createElement("div");switch(d.classList.add("popover-inner"),d.dataset.contentType=D??void 0,F.appendChild(d),a){case"image":let m=document.createElement("img");m.src=r.toString(),m.alt=r.pathname,d.appendChild(m);break;case"application":if(f==="pdf"){let p=document.createElement("iframe");p.src=r.toString(),d.appendChild(p)}break;default:let g=await c.text(),h=Ve.parseFromString(g,"text/html");oe(h,r),h.querySelectorAll("[id]").forEach(p=>{let E=`popover-internal-${p.id}`;p.id=E});let A=[...h.getElementsByClassName("popover-hint")];if(A.length===0)return;A.forEach(p=>d.appendChild(p))}document.getElementById(l)||(document.body.appendChild(F),Ct===this&&o(F))}function xt(){Ct=null,document.querySelectorAll(".popover").forEach(e=>e.classList.remove("active-popover"))}document.addEventListener("nav",()=>{let t=[...document.querySelectorAll("a.internal")];for(let e of t)e.addEventListener("mouseenter",re),e.addEventListener("mouseleave",xt),window.addCleanup(()=>{e.removeEventListener("mouseenter",re),e.removeEventListener("mouseleave",xt)})});\n';var custom_default=`@charset "UTF-8";
/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
code[data-theme*=" "] {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}

code[data-theme*=" "] span {
  color: var(--shiki-light);
}

[saved-theme=dark] code[data-theme*=" "] {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}

[saved-theme=dark] code[data-theme*=" "] span {
  color: var(--shiki-dark);
}

.callout {
  border: 1px solid var(--border);
  background-color: var(--bg);
  border-radius: 5px;
  padding: 0 1rem;
  overflow-y: hidden;
  box-sizing: border-box;
}
.callout > .callout-content {
  display: grid;
  transition: grid-template-rows 0.1s cubic-bezier(0.02, 0.01, 0.47, 1);
  overflow: hidden;
}
.callout > .callout-content > :first-child {
  margin-top: 0;
}
.callout {
  --callout-icon-note: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>');
  --callout-icon-abstract: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>');
  --callout-icon-info: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>');
  --callout-icon-todo: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>');
  --callout-icon-tip: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg> ');
  --callout-icon-success: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ');
  --callout-icon-question: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> ');
  --callout-icon-warning: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>');
  --callout-icon-failure: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> ');
  --callout-icon-danger: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> ');
  --callout-icon-bug: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="14" x="8" y="6" rx="4"></rect><path d="m19 7-3 2"></path><path d="m5 7 3 2"></path><path d="m19 19-3-2"></path><path d="m5 19 3-2"></path><path d="M20 13h-4"></path><path d="M4 13h4"></path><path d="m10 4 1 2"></path><path d="m14 4-1 2"></path></svg>');
  --callout-icon-example: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> ');
  --callout-icon-quote: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>');
  --callout-icon-fold: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpolyline points="6 9 12 15 18 9"%3E%3C/polyline%3E%3C/svg%3E');
}
.callout[data-callout] {
  --color: #448aff;
  --border: #448aff44;
  --bg: #448aff10;
  --callout-icon: var(--callout-icon-note);
}
.callout[data-callout=abstract] {
  --color: #00b0ff;
  --border: #00b0ff44;
  --bg: #00b0ff10;
  --callout-icon: var(--callout-icon-abstract);
}
.callout[data-callout=info], .callout[data-callout=todo] {
  --color: #00b8d4;
  --border: #00b8d444;
  --bg: #00b8d410;
  --callout-icon: var(--callout-icon-info);
}
.callout[data-callout=todo] {
  --callout-icon: var(--callout-icon-todo);
}
.callout[data-callout=tip] {
  --color: #00bfa5;
  --border: #00bfa544;
  --bg: #00bfa510;
  --callout-icon: var(--callout-icon-tip);
}
.callout[data-callout=success] {
  --color: #09ad7a;
  --border: #09ad7144;
  --bg: #09ad7110;
  --callout-icon: var(--callout-icon-success);
}
.callout[data-callout=question] {
  --color: #dba642;
  --border: #dba64244;
  --bg: #dba64210;
  --callout-icon: var(--callout-icon-question);
}
.callout[data-callout=warning] {
  --color: #db8942;
  --border: #db894244;
  --bg: #db894210;
  --callout-icon: var(--callout-icon-warning);
}
.callout[data-callout=failure], .callout[data-callout=danger], .callout[data-callout=bug] {
  --color: #db4242;
  --border: #db424244;
  --bg: #db424210;
  --callout-icon: var(--callout-icon-failure);
}
.callout[data-callout=bug] {
  --callout-icon: var(--callout-icon-bug);
}
.callout[data-callout=danger] {
  --callout-icon: var(--callout-icon-danger);
}
.callout[data-callout=example] {
  --color: #7a43b5;
  --border: #7a43b544;
  --bg: #7a43b510;
  --callout-icon: var(--callout-icon-example);
}
.callout[data-callout=quote] {
  --color: var(--secondary);
  --border: var(--lightgray);
  --callout-icon: var(--callout-icon-quote);
}
.callout.is-collapsed > .callout-title > .fold-callout-icon {
  transform: rotateZ(-90deg);
}
.callout.is-collapsed .callout-content > * {
  transition: height 0.1s cubic-bezier(0.02, 0.01, 0.47, 1), margin 0.1s cubic-bezier(0.02, 0.01, 0.47, 1), padding 0.1s cubic-bezier(0.02, 0.01, 0.47, 1);
  overflow-y: clip;
  height: 0;
  margin-bottom: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-top: 0;
}
.callout.is-collapsed .callout-content > :first-child {
  margin-top: -1rem;
}

.callout-title {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  padding: 1rem 0;
  color: var(--color);
  --icon-size: 18px;
}
.callout-title .fold-callout-icon {
  transition: transform 0.15s ease;
  opacity: 0.8;
  cursor: pointer;
  --callout-icon: var(--callout-icon-fold);
}
.callout-title > .callout-title-inner > p {
  color: var(--color);
  margin: 0;
}
.callout-title .callout-icon, .callout-title .fold-callout-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  flex: 0 0 var(--icon-size);
  background-size: var(--icon-size) var(--icon-size);
  background-position: center;
  background-color: var(--color);
  mask-image: var(--callout-icon);
  mask-size: var(--icon-size) var(--icon-size);
  mask-position: center;
  mask-repeat: no-repeat;
  padding: 0.2rem 0;
}
.callout-title .callout-title-inner {
  font-weight: 600;
}

html {
  scroll-behavior: smooth;
  text-size-adjust: none;
  overflow-x: hidden;
  width: 100vw;
}
@media all and ((max-width: 800px)) {
  html {
    scroll-padding-top: 4rem;
  }
}

body {
  margin: 0;
  box-sizing: border-box;
  background-color: var(--light);
  font-family: var(--bodyFont);
  color: var(--darkgray);
}

.text-highlight {
  background-color: var(--textHighlight);
  padding: 0 0.1rem;
  border-radius: 5px;
}

::selection {
  background: color-mix(in srgb, var(--tertiary) 60%, rgba(255, 255, 255, 0));
  color: var(--darkgray);
}

p,
ul,
text,
a,
tr,
td,
li,
ol,
ul,
.katex,
.math,
.typst-doc,
g[class~=typst-text] {
  color: var(--darkgray);
  fill: var(--darkgray);
  overflow-wrap: break-word;
  text-wrap: pretty;
}

path[class~=typst-shape] {
  stroke: var(--darkgray);
}

.math.math-display {
  text-align: center;
}

article > mjx-container.MathJax,
article blockquote > div > mjx-container.MathJax {
  display: flex;
}
article > mjx-container.MathJax > svg,
article blockquote > div > mjx-container.MathJax > svg {
  margin-left: auto;
  margin-right: auto;
}
article blockquote > div > mjx-container.MathJax > svg {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

strong {
  font-weight: 600;
}

a {
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
  color: var(--secondary);
}
a:hover {
  color: var(--tertiary);
}
a.internal {
  text-decoration: none;
  background-color: var(--highlight);
  padding: 0 0.1rem;
  border-radius: 5px;
  line-height: 1.4rem;
}
a.internal.broken {
  color: var(--secondary);
  opacity: 0.5;
  transition: opacity 0.2s ease;
}
a.internal.broken:hover {
  opacity: 0.8;
}
a.internal:has(> img) {
  background-color: transparent;
  border-radius: 0;
  padding: 0;
}
a.internal.tag-link::before {
  content: "#";
}
a.external .external-icon {
  height: 1ex;
  margin: 0 0.15em;
}
a.external .external-icon > path {
  fill: var(--dark);
}

.flex-component {
  display: flex;
}

.desktop-only {
  display: initial;
}
.desktop-only.flex-component {
  display: flex;
}
@media all and ((max-width: 800px)) {
  .desktop-only.flex-component {
    display: none;
  }
  .desktop-only {
    display: none;
  }
}

.mobile-only {
  display: none;
}
.mobile-only.flex-component {
  display: none;
}
@media all and ((max-width: 800px)) {
  .mobile-only.flex-component {
    display: flex;
  }
  .mobile-only {
    display: initial;
  }
}

.page {
  max-width: calc(1200px + 300px);
  margin: 0 auto;
}
.page article > h1 {
  font-size: 2rem;
}
.page article li:has(> input[type=checkbox]) {
  list-style-type: none;
  padding-left: 0;
}
.page article li:has(> input[type=checkbox]:checked) {
  text-decoration: line-through;
  text-decoration-color: var(--gray);
  color: var(--gray);
}
.page article li > * {
  margin-top: 0;
  margin-bottom: 0;
}
.page article p > strong {
  color: var(--dark);
}
.page > #quartz-body {
  display: grid;
  grid-template-columns: 320px auto 320px;
  grid-template-rows: auto auto auto;
  column-gap: 5px;
  row-gap: 5px;
  grid-template-areas: "grid-sidebar-left grid-header grid-sidebar-right"      "grid-sidebar-left grid-center grid-sidebar-right"      "grid-sidebar-left grid-footer grid-sidebar-right";
}
@media all and ((min-width: 800px) and (max-width: 1200px)) {
  .page > #quartz-body {
    grid-template-columns: 320px auto;
    grid-template-rows: auto auto auto auto;
    column-gap: 5px;
    row-gap: 5px;
    grid-template-areas: "grid-sidebar-left grid-header"      "grid-sidebar-left grid-center"      "grid-sidebar-left grid-sidebar-right"      "grid-sidebar-left grid-footer";
  }
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body {
    grid-template-columns: auto;
    grid-template-rows: auto auto auto auto auto;
    column-gap: 5px;
    row-gap: 5px;
    grid-template-areas: "grid-sidebar-left"      "grid-header"      "grid-center"      "grid-sidebar-right"      "grid-footer";
  }
}
@media all and not ((min-width: 1200px)) {
  .page > #quartz-body {
    padding: 0 1rem;
  }
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body {
    margin: 0 auto;
  }
}
.page > #quartz-body .sidebar {
  gap: 1.2rem;
  top: 0;
  box-sizing: border-box;
  padding: 6rem 2rem 2rem 2rem;
  display: flex;
  height: 100vh;
  position: sticky;
}
.page > #quartz-body .sidebar.left {
  z-index: 1;
  grid-area: grid-sidebar-left;
  flex-direction: column;
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .sidebar.left {
    gap: 0;
    align-items: center;
    position: initial;
    display: flex;
    height: unset;
    flex-direction: row;
    padding: 0;
    padding-top: 2rem;
  }
}
.page > #quartz-body .sidebar.right {
  grid-area: grid-sidebar-right;
  margin-right: 0;
  flex-direction: column;
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .sidebar.right {
    margin-left: inherit;
    margin-right: inherit;
  }
}
@media all and not ((min-width: 1200px)) {
  .page > #quartz-body .sidebar.right {
    position: initial;
    height: unset;
    width: 100%;
    flex-direction: row;
    padding: 0;
  }
  .page > #quartz-body .sidebar.right > * {
    flex: 1;
    max-height: 24rem;
  }
  .page > #quartz-body .sidebar.right > .toc {
    display: none;
  }
}
.page > #quartz-body .page-header, .page > #quartz-body .page-footer {
  margin-top: 1rem;
}
.page > #quartz-body .page-header {
  grid-area: grid-header;
  margin: 6rem 0 0 0;
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .page-header {
    margin-top: 0;
    padding: 0;
  }
}
.page > #quartz-body .center > article {
  grid-area: grid-center;
}
.page > #quartz-body footer {
  grid-area: grid-footer;
}
.page > #quartz-body .center, .page > #quartz-body footer {
  max-width: 100%;
  min-width: 100%;
  margin-left: auto;
  margin-right: auto;
}
@media all and ((min-width: 800px) and (max-width: 1200px)) {
  .page > #quartz-body .center, .page > #quartz-body footer {
    margin-right: 0;
  }
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .center, .page > #quartz-body footer {
    margin-right: 0;
    margin-left: 0;
  }
}
.page > #quartz-body footer {
  margin-left: 0;
}

.footnotes {
  margin-top: 2rem;
  border-top: 1px solid var(--lightgray);
}

input[type=checkbox] {
  transform: translateY(2px);
  color: var(--secondary);
  border: 1px solid var(--lightgray);
  border-radius: 3px;
  background-color: var(--light);
  position: relative;
  margin-inline-end: 0.2rem;
  margin-inline-start: -1.4rem;
  appearance: none;
  width: 16px;
  height: 16px;
}
input[type=checkbox]:checked {
  border-color: var(--secondary);
  background-color: var(--secondary);
}
input[type=checkbox]:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  display: block;
  border: solid var(--light);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

blockquote {
  margin: 1rem 0;
  border-left: 3px solid var(--secondary);
  padding-left: 1rem;
  transition: border-color 0.2s ease;
}

h1,
h2,
h3,
h4,
h5,
h6,
thead {
  font-family: var(--headerFont);
  color: var(--dark);
  font-weight: revert;
  margin-bottom: 0;
}
article > h1 > a[role=anchor],
article > h2 > a[role=anchor],
article > h3 > a[role=anchor],
article > h4 > a[role=anchor],
article > h5 > a[role=anchor],
article > h6 > a[role=anchor],
article > thead > a[role=anchor] {
  color: var(--dark);
  background-color: transparent;
}

h1[id] > a[href^="#"],
h2[id] > a[href^="#"],
h3[id] > a[href^="#"],
h4[id] > a[href^="#"],
h5[id] > a[href^="#"],
h6[id] > a[href^="#"] {
  margin: 0 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: translateY(-0.1rem);
  font-family: var(--codeFont);
  user-select: none;
}
h1[id]:hover > a,
h2[id]:hover > a,
h3[id]:hover > a,
h4[id]:hover > a,
h5[id]:hover > a,
h6[id]:hover > a {
  opacity: 1;
}
h1:not([id]) > a[role=anchor],
h2:not([id]) > a[role=anchor],
h3:not([id]) > a[role=anchor],
h4:not([id]) > a[role=anchor],
h5:not([id]) > a[role=anchor],
h6:not([id]) > a[role=anchor] {
  display: none;
}

h1 {
  font-size: 1.75rem;
  margin-top: 2.25rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.4rem;
  margin-top: 1.9rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.12rem;
  margin-top: 1.62rem;
  margin-bottom: 1rem;
}

h4,
h5,
h6 {
  font-size: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

figure[data-rehype-pretty-code-figure] {
  margin: 0;
  position: relative;
  line-height: 1.6rem;
  position: relative;
}
figure[data-rehype-pretty-code-figure] > [data-rehype-pretty-code-title] {
  font-family: var(--codeFont);
  font-size: 0.9rem;
  padding: 0.1rem 0.5rem;
  border: 1px solid var(--lightgray);
  width: fit-content;
  border-radius: 5px;
  margin-bottom: -0.5rem;
  color: var(--darkgray);
}
figure[data-rehype-pretty-code-figure] > pre {
  padding: 0;
}

pre {
  font-family: var(--codeFont);
  padding: 0 0.5rem;
  border-radius: 5px;
  overflow-x: auto;
  border: 1px solid var(--lightgray);
  position: relative;
}
pre:has(> code.mermaid) {
  border: none;
}
pre > code {
  background: none;
  padding: 0;
  font-size: 0.85rem;
  counter-reset: line;
  counter-increment: line 0;
  display: grid;
  padding: 0.5rem 0;
  overflow-x: auto;
}
pre > code [data-highlighted-chars] {
  background-color: var(--highlight);
  border-radius: 5px;
}
pre > code > [data-line] {
  padding: 0 0.25rem;
  box-sizing: border-box;
  border-left: 3px solid transparent;
}
pre > code > [data-line][data-highlighted-line] {
  background-color: var(--highlight);
  border-left: 3px solid var(--secondary);
}
pre > code > [data-line]::before {
  content: counter(line);
  counter-increment: line;
  width: 1rem;
  margin-right: 1rem;
  display: inline-block;
  text-align: right;
  color: rgba(115, 138, 148, 0.6);
}
pre > code[data-line-numbers-max-digits="2"] > [data-line]::before {
  width: 2rem;
}
pre > code[data-line-numbers-max-digits="3"] > [data-line]::before {
  width: 3rem;
}

code {
  font-size: 0.9em;
  color: var(--dark);
  font-family: var(--codeFont);
  border-radius: 5px;
  padding: 0.1rem 0.2rem;
  background: var(--lightgray);
}

tbody,
li,
p {
  line-height: 1.6rem;
}

.table-container {
  overflow-x: auto;
}
.table-container > table {
  margin: 1rem;
  padding: 1.5rem;
  border-collapse: collapse;
}
.table-container > table th,
.table-container > table td {
  min-width: 75px;
}
.table-container > table > * {
  line-height: 2rem;
}

th {
  text-align: left;
  padding: 0.4rem 0.7rem;
  border-bottom: 2px solid var(--gray);
}

td {
  padding: 0.2rem 0.7rem;
}

tr {
  border-bottom: 1px solid var(--lightgray);
}
tr:last-child {
  border-bottom: none;
}

img {
  max-width: 100%;
  border-radius: 5px;
  margin: 1rem 0;
  content-visibility: auto;
}

p > img + em {
  display: block;
  transform: translateY(-1rem);
}

hr {
  width: 100%;
  margin: 2rem auto;
  height: 1px;
  border: none;
  background-color: var(--lightgray);
}

audio,
video {
  width: 100%;
  border-radius: 5px;
}

.spacer {
  flex: 2 1 auto;
}

div:has(> .overflow) {
  max-height: 100%;
  overflow-y: hidden;
}

ul.overflow,
ol.overflow {
  max-height: 100%;
  overflow-y: auto;
  width: 100%;
  margin-bottom: 0;
  content: "";
  clear: both;
}
ul.overflow > li.overflow-end,
ol.overflow > li.overflow-end {
  height: 0.5rem;
  margin: 0;
}
ul.overflow.gradient-active,
ol.overflow.gradient-active {
  mask-image: linear-gradient(to bottom, black calc(100% - 50px), transparent 100%);
}

.transclude ul {
  padding-left: 1rem;
}

.katex-display {
  display: initial;
  overflow-x: auto;
  overflow-y: hidden;
}

.external-embed.youtube,
iframe.pdf {
  aspect-ratio: 16/9;
  height: 100%;
  width: 100%;
  border-radius: 5px;
}

.navigation-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--secondary);
  transition: width 0.2s ease;
  z-index: 9999;
}

/* ===== \u6839\u5BB9\u5668\u6491\u6EE1\u5C4F\u5E55 ===== */
#quartz-root {
  max-width: 100% !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* ===== \u80CC\u666F + \u6781\u6DE1\u5149\u6655 + \u5FAE\u6A21\u7CCA ===== */
html, body {
  background-image: url("static/bp.jpg") !important;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 40%, rgba(130, 170, 230, 0.25) 0%, transparent 55%), radial-gradient(circle at 70% 60%, rgba(180, 140, 220, 0.15) 0%, transparent 55%);
  backdrop-filter: blur(2px);
  z-index: -1;
  pointer-events: none;
}

.dark body::after {
  background: radial-gradient(circle at 30% 40%, rgba(80, 120, 200, 0.3) 0%, transparent 55%), radial-gradient(circle at 70% 60%, rgba(120, 90, 180, 0.2) 0%, transparent 55%);
  backdrop-filter: blur(2px);
}

/* ===== \u4FA7\u8FB9\u680F\u5BB9\u5668\uFF1A\u4EC5\u5BF9 sidebar \u81EA\u8EAB\u548C\u76F4\u63A5\u5B50\u5143\u7D20\u53BB\u80CC\u666F ===== */
#quartz-root .left,
#quartz-root .right {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  width: 260px !important;
  flex-shrink: 0;
  margin: 0 !important;
  padding: 0 !important;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  background: transparent !important;
  background-color: transparent !important;
}

.dark #quartz-root .left,
.dark #quartz-root .right {
  backdrop-filter: blur(4px);
}

#quartz-root .left > *,
#quartz-root .right > *,
#quartz-root .left .explorer,
#quartz-root .left .search,
#quartz-root .left .darkmode,
#quartz-root .left .page-title,
#quartz-root .right .profile-card,
#quartz-root .left .folder-container,
#quartz-root .left .file-title {
  background: transparent !important;
  background-color: transparent !important;
}

#quartz-root .left .explorer-title,
#quartz-root .left .folder-title,
#quartz-root .left .file-title,
#quartz-root .left input,
#quartz-root .left .search-input,
#quartz-root .left .page-title,
#quartz-root .left .darkmode-container,
#quartz-root .right .profile-card {
  padding: 0.3rem 0.6rem !important;
}

#quartz-root .left > *:first-child,
#quartz-root .right > *:first-child {
  padding-top: 1rem !important;
}

#quartz-root .left > *:last-child,
#quartz-root .right > *:last-child {
  padding-bottom: 1rem !important;
}

/* ===== \u5DE6\u4FA7\u6587\u4EF6\u6811\uFF1A\u5DE6\u5185\u8FB9\u8DDD\u5B9E\u73B0\u89C6\u89C9\u5C45\u4E2D ===== */
#quartz-root .left .explorer {
  padding-left: 2.5rem !important;
  box-sizing: border-box;
}

#quartz-root .left .folder-container,
#quartz-root .left .file-title {
  padding-left: 0 !important;
  margin-left: 0 !important;
}

/* ===== \u53F3\u4FA7\u4E2A\u4EBA\u4FE1\u606F\u5361\u7247 ===== */
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.profile-avatar {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(58, 110, 165, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.profile-name {
  font-family: "Noto Serif SC", serif;
  font-size: 1.1rem;
  font-weight: 900;
  color: #000;
}

.dark .profile-name {
  color: #8fb9f0;
}

.profile-motto {
  font-size: 0.8rem;
  color: #4a5568;
  font-style: italic;
  line-height: 1.4;
}

.dark .profile-motto {
  color: #a0aec0;
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.8rem;
}

.profile-nav a {
  color: #3a6ea5;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  border-bottom: none;
  transition: color 0.2s;
}

.profile-nav a:hover {
  color: #5d8fc0;
}

.dark .profile-nav a {
  color: #6b9fd4;
}

.dark .profile-nav a:hover {
  color: #8ab8e8;
}

/* ===== \u53F3\u4FA7\u6587\u7AE0\u76EE\u5F55\u6837\u5F0F ===== */
.right .toc {
  margin-top: 1.5rem;
}

.right .toc ul {
  list-style: none;
  padding-left: 0.5rem;
}

.right .toc li {
  margin: 0.3rem 0;
}

.right .toc a {
  color: var(--darkgray);
  font-size: 0.9rem;
  text-decoration: none;
  border-bottom: none;
}

.right .toc a:hover {
  color: var(--secondary);
}

/* ===== \u4E2D\u95F4\u5185\u5BB9\u533A ===== */
#quartz-root .center {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 2.5rem;
  overflow-y: auto;
  height: auto;
  background: transparent !important;
}

/* ===== \u6587\u7AE0\u5361\u7247 ===== */
.page {
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 2.5rem 3rem;
  width: auto;
  max-width: 860px;
  box-shadow: 0 4px 24px rgba(58, 110, 165, 0.04), 0 0 0 1px rgba(58, 110, 165, 0.04);
}

.dark .page {
  background-color: rgba(30, 41, 59, 0.7);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(107, 159, 212, 0.06);
}

.page > article,
.page > article * {
  text-align: left !important;
}

/* ===== \u5F3A\u5316\u52A0\u7C97\u6548\u679C ===== */
strong, b {
  font-weight: 800;
  color: #0a141f;
}

.dark strong, .dark b {
  color: #ffffff;
}

/* ===== \u6B63\u6587\u6392\u7248 ===== */
body {
  font-family: "Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 1.08em;
  line-height: 1.8;
  color: #1a1e24 !important;
  font-weight: 400;
}

.dark body {
  color: #e8ecf2 !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Noto Serif SC", serif;
  line-height: 1.4;
  margin-top: 2em;
  margin-bottom: 0.6em;
}

h1 {
  font-size: 1.8em;
  color: #08367c !important;
  font-weight: 700;
}

h2 {
  font-size: 1.5em;
  color: #004faa !important;
  font-weight: 700;
}

h3 {
  font-size: 1.3em;
  color: #0e64bb !important;
  font-weight: 700;
}

h4 {
  font-size: 1.15em;
  color: #3481c5 !important;
  font-weight: 600;
}

h5 {
  font-size: 1.05em;
  color: #59a0e2 !important;
  font-weight: 600;
}

h6 {
  font-size: 0.95em;
  color: #88b8e6 !important;
  font-weight: 600;
}

.dark h1 {
  color: #8fb9f0 !important;
}

.dark h2 {
  color: #7aade6 !important;
}

.dark h3 {
  color: #6a9fd4 !important;
}

.dark h4 {
  color: #5b8fc2 !important;
}

.dark h5 {
  color: #4e7fb0 !important;
}

.dark h6 {
  color: #3e6f9e !important;
}

.article-title {
  font-size: 2em;
  color: #08367c !important;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.dark .article-title {
  color: #8fb9f0 !important;
}

blockquote {
  border-left: 3px solid #3a6ea5;
  background-color: rgba(58, 110, 165, 0.05);
  border-radius: 6px;
  padding: 0.9rem 1.2rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #2c3a4b;
}

.dark blockquote {
  border-left-color: #6b9fd4;
  background-color: rgba(107, 159, 212, 0.1);
  color: #c0c8d4;
}

code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9em;
  background-color: rgba(58, 110, 165, 0.12);
  color: #2c5282;
  border-radius: 4px;
  padding: 0.15em 0.4em;
}

.dark code {
  background-color: rgba(107, 159, 212, 0.15);
  color: #8ab8e8;
}

pre {
  border: 1px solid rgba(58, 110, 165, 0.15);
  border-radius: 10px;
  background-color: rgba(245, 248, 252, 0.6) !important;
  padding: 1.2rem 1.5rem;
  font-size: 0.9em;
}

.dark pre {
  background-color: rgba(0, 0, 0, 0.35) !important;
  border-color: rgba(107, 159, 212, 0.2);
}

.tag {
  display: inline-block;
  border-radius: 20px;
  padding: 0.2em 0.8em;
  font-size: 0.8em;
  font-weight: 500;
  background-color: rgba(58, 110, 165, 0.12);
  color: #2c5282;
  margin-right: 0.4em;
  margin-bottom: 0.3em;
  transition: all 0.2s;
}

.tag:hover {
  background-color: #3a6ea5;
  color: #fff;
}

.dark .tag {
  background-color: rgba(107, 159, 212, 0.15);
  color: #8ab8e8;
}

.dark .tag:hover {
  background-color: #6b9fd4;
  color: #fff;
}

a {
  color: #3a6ea5;
  text-decoration: none;
  border-bottom: 1px solid rgba(58, 110, 165, 0.3);
  transition: all 0.2s;
}

a:hover {
  color: #2c5282;
  border-bottom-color: #2c5282;
}

.dark a {
  color: #6b9fd4;
  border-bottom-color: rgba(107, 159, 212, 0.3);
}

.dark a:hover {
  color: #8ab8e8;
  border-bottom-color: #8ab8e8;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
}

::-webkit-scrollbar-thumb {
  background: #8b9bb5;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3a6ea5;
}

::selection {
  background: rgba(160, 196, 232, 0.5333333333);
  color: #1e2a36;
}

.dark ::selection {
  background: rgba(74, 106, 138, 0.5333333333);
  color: #e0e8f2;
}

.popover,
.search > .search-container {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* ===== \u4FDD\u62A4 giscus \u8BC4\u8BBA\u533A ===== */
.giscus,
.giscus * {
  all: unset !important;
  display: revert !important;
}

.giscus {
  width: 100% !important;
  max-width: 860px;
  margin-top: 2rem auto 0 auto !important;
}

.giscus iframe {
  width: 100% !important;
  height: auto !important;
  min-height: 800px !important;
  display: block !important;
}

/* \u4E2D\u7B49\u5C4F\u5E55\u9002\u914D */
@media (max-width: 1450px) {
  #quartz-root .left,
  #quartz-root .right {
    width: 220px !important;
  }
  #quartz-root .left .explorer {
    padding-left: 3rem !important;
  }
  #quartz-root .center {
    padding: 2rem 1.5rem;
  }
  .page {
    padding: 2rem 2rem;
  }
}
/* \u79FB\u52A8\u7AEF\u9690\u85CF\u4FA7\u8FB9\u680F */
@media (max-width: 1200px) {
  #quartz-root .left,
  #quartz-root .right {
    display: none;
  }
  #quartz-root .center {
    padding: 2rem 1.5rem;
  }
  .page {
    padding: 2rem 1.5rem;
    max-width: 100%;
  }
}
/* \u4FEE\u590D\u6587\u7AE0\u5217\u8868\u4E2D\u91CD\u590D h1 \u7684\u95EE\u9898 */
.page-listing h1,
.section-li h1 {
  font-size: 1.2em;
  font-weight: 500;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhcmlhYmxlcy5zY3NzIiwic3ludGF4LnNjc3MiLCJjYWxsb3V0cy5zY3NzIiwiYmFzZS5zY3NzIiwiY3VzdG9tLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FDRkE7RUFDRTtFQUNBOzs7QUFHRjtFQUNFOzs7QUFHRjtFQUNFO0VBQ0E7OztBQUdGO0VBQ0U7OztBQ1pGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBZE47RUFrQkU7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFFRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFHRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFJQTtFQUNFOztBQUlBO0VBQ0UsWUFDRTtFQUdGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFRjtFQUNFOzs7QUFNUjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFFQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUVFO0VBQ0E7RUFDQTtFQUdBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRSxhRmxLYTs7O0FHaEJqQjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBTkY7SUFPSTs7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7OztBQUVGO0VBQ0U7RUFDQTs7O0FBR0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFhRTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTs7O0FBSUE7RUFDRTs7O0FBS0Y7QUFBQTtFQUVFOztBQUNBO0FBQUE7RUFDRTtFQUNBOztBQUdKO0VBQ0U7RUFDQTs7O0FBSUo7RUFDRSxhSDFEZTs7O0FHNkRqQjtFQUNFLGFIOURlO0VHK0RmO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFDQTtFQUNFOztBQUlKO0VBQ0U7RUFDQTtFQUNBOztBQUdBO0VBQ0U7O0FBS047RUFDRTtFQUNBOztBQUVBO0VBQ0U7OztBQUtOO0VBQ0U7OztBQUdGO0VBQ0U7O0FBQ0E7RUFDRTs7QUFFRjtFQUNFO0lBQ0U7O0VBUE47SUFTSTs7OztBQUlKO0VBQ0U7O0FBQ0E7RUFDRTs7QUFFRjtFQUNFO0lBQ0U7O0VBUE47SUFTSTs7OztBQUlKO0VBQ0U7RUFDQTs7QUFFRTtFQUNFOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQVJGO0lBU0k7SUFDQTtJQUNBO0lBQ0E7SUFDQTs7O0FBRUY7RUFmRjtJQWdCSTtJQUNBO0lBQ0E7SUFDQTtJQUNBOzs7QUFHRjtFQXZCRjtJQXdCSTs7O0FBRUY7RUExQkY7SUEyQkk7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBQ0E7RUFKRjtJQUtJO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7OztBQUlKO0VBQ0U7RUFDQTtFQUNBOztBQUNBO0VBSkY7SUFLSTtJQUNBOzs7QUFFRjtFQVJGO0lBU0k7SUFDQTtJQUNBO0lBQ0E7SUFDQTs7RUFDQTtJQUNFO0lBQ0E7O0VBRUY7SUFDRTs7O0FBSU47RUFFRTs7QUFHRjtFQUNFO0VBQ0E7O0FBQ0E7RUFIRjtJQUlJO0lBQ0E7OztBQUlKO0VBQ0U7O0FBR0Y7RUFDRTs7QUFHRjtFQUVFO0VBQ0E7RUFDQTtFQUNBOztBQUNBO0VBTkY7SUFPSTs7O0FBRUY7RUFURjtJQVVJO0lBQ0E7OztBQUdKO0VBQ0U7OztBQUtOO0VBQ0U7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtFQU9FO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBQ0U7RUFDQTs7O0FBVUY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtFQUNFOztBQUdGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtFQUNFOzs7QUFLSjtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBOzs7QUFHRjtBQUFBO0FBQUE7RUFHRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFJSjtFQUNFOztBQUdGO0VBQ0U7OztBQUtOO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtBQUFBO0FBQUE7RUFHRTs7O0FBR0Y7RUFDRTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFFQTtBQUFBO0VBRUU7O0FBR0Y7RUFDRTs7O0FBS047RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7OztBQUdGO0VBQ0U7O0FBQ0E7RUFDRTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0FBQUE7RUFFRTtFQUNBOzs7QUFHRjtFQUNFOzs7QUFHRjtFQUNFO0VBQ0E7OztBQUdGO0FBQUE7RUFFRTtFQUNBO0VBQ0E7RUFDQTtFQUdBO0VBQ0E7O0FBRUE7QUFBQTtFQUNFO0VBQ0E7O0FBR0Y7QUFBQTtFQUNFOzs7QUFLRjtFQUNFOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7QUFBQTtFQUVFO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQzduQkY7QUFDQTtFQUNFO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtBQUNBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUVGO0VBQ0U7RUFDQTtFQUNBO0VBQVE7RUFDUjtFQUFhO0VBQ2IsWUFDRTtFQUVGO0VBQ0E7RUFDQTs7O0FBRUY7RUFDRSxZQUNFO0VBRUY7OztBQUdGO0FBQ0E7QUFBQTtFQUVFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBRUY7QUFBQTtFQUVFOzs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFTRTtFQUNBOzs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBUUU7OztBQUVGO0FBQUE7RUFDc0M7OztBQUN0QztBQUFBO0VBQ3FDOzs7QUFFckM7QUFDQTtFQUNFO0VBQ0E7OztBQUVGO0FBQUE7RUFFRTtFQUNBOzs7QUFHRjtBQUNBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBRUY7RUFDRTtFQUFhO0VBQ2I7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBRUY7RUFBd0I7OztBQUN4QjtFQUNFO0VBQ0E7RUFBbUI7RUFDbkI7OztBQUVGO0VBQXNCOzs7QUFDdEI7RUFDRTtFQUFtQjtFQUNuQjtFQUFvQjs7O0FBRXRCO0VBQXVCOzs7QUFDdkI7RUFDRTtFQUFlO0VBQXdCO0VBQ3ZDOzs7QUFFRjtFQUNFO0VBQWdCO0VBQ2hCO0VBQW9CO0VBQ3BCO0VBQXFCOzs7QUFFdkI7RUFBdUI7OztBQUN2QjtFQUF1Qjs7O0FBQ3ZCO0VBQTZCOzs7QUFFN0I7QUFDQTtFQUNFOzs7QUFFRjtFQUNFO0VBQ0E7OztBQUVGO0VBQ0U7OztBQUVGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7OztBQUVGO0VBQ0U7OztBQUdGO0FBQ0E7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7QUFDQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7OztBQUlGO0FBQUE7RUFFRTs7O0FBR0Y7QUFDQTtFQUNFO0VBQ0E7OztBQUVGO0VBQ0U7OztBQUdGO0FBQ0E7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFFRjtFQUFhOzs7QUFFYjtFQUNFO0VBQ0E7RUFDQTtFQUNBOzs7QUFFRjtFQUFLO0VBQWtCO0VBQTJCOzs7QUFDbEQ7RUFBSztFQUFrQjtFQUEyQjs7O0FBQ2xEO0VBQUs7RUFBa0I7RUFBMkI7OztBQUNsRDtFQUFLO0VBQW1CO0VBQTJCOzs7QUFDbkQ7RUFBSztFQUFtQjtFQUEyQjs7O0FBQ25EO0VBQUs7RUFBbUI7RUFBMkI7OztBQUVuRDtFQUFXOzs7QUFDWDtFQUFXOzs7QUFDWDtFQUFXOzs7QUFDWDtFQUFXOzs7QUFDWDtFQUFXOzs7QUFDWDtFQUFXOzs7QUFFWDtFQUNFO0VBQWdCO0VBQ2hCO0VBQWtCO0VBQ2xCOzs7QUFFRjtFQUF1Qjs7O0FBRXZCO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUVGO0VBQW1CO0VBQTRCO0VBQTRDOzs7QUFFM0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUVGO0VBQWE7RUFBNkM7OztBQUUxRDtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUVGO0VBQVk7RUFBa0Q7OztBQUU5RDtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFBcUI7RUFDckI7OztBQUVGO0VBQWE7RUFBMkI7OztBQUN4QztFQUFhO0VBQTZDOzs7QUFDMUQ7RUFBbUI7RUFBMkI7OztBQUU5QztFQUNFO0VBQWdCO0VBQ2hCO0VBQ0E7OztBQUVGO0VBQVU7RUFBZ0I7OztBQUMxQjtFQUFVO0VBQWdCOzs7QUFDMUI7RUFBZ0I7RUFBZ0I7OztBQUVoQztFQUFzQjs7O0FBQ3RCO0VBQTRCOzs7QUFDNUI7RUFBNEI7RUFBcUI7OztBQUNqRDtFQUFrQzs7O0FBRWxDO0VBQWM7RUFBdUI7OztBQUNyQztFQUFvQjtFQUF1Qjs7O0FBRTNDO0FBQUE7RUFFRTtFQUNBOzs7QUFHRjtBQUNBO0FBQUE7RUFFRTtFQUNBOzs7QUFFRjtFQUNFO0VBQ0E7RUFDQTs7O0FBRUY7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7QUFDQTtFQUNFO0FBQUE7SUFFRTs7RUFFRjtJQUNFOztFQUVGO0lBQ0U7O0VBRUY7SUFDRTs7O0FBSUo7QUFDQTtFQUNFO0FBQUE7SUFFRTs7RUFFRjtJQUNFOztFQUVGO0lBQ0U7SUFDQTs7O0FBSUo7QUFDQTtBQUFBO0VBRUU7RUFDQSIsInNvdXJjZXNDb250ZW50IjpbIkB1c2UgXCJzYXNzOm1hcFwiO1xuXG4vKipcbiAqIExheW91dCBicmVha3BvaW50c1xuICogJG1vYmlsZTogc2NyZWVuIHdpZHRoIGJlbG93IHRoaXMgdmFsdWUgd2lsbCB1c2UgbW9iaWxlIHN0eWxlc1xuICogJGRlc2t0b3A6IHNjcmVlbiB3aWR0aCBhYm92ZSB0aGlzIHZhbHVlIHdpbGwgdXNlIGRlc2t0b3Agc3R5bGVzXG4gKiBTY3JlZW4gd2lkdGggYmV0d2VlbiAkbW9iaWxlIGFuZCAkZGVza3RvcCB3aWR0aCB3aWxsIHVzZSB0aGUgdGFibGV0IGxheW91dC5cbiAqIGFzc3VtaW5nIG1vYmlsZSA8IGRlc2t0b3BcbiAqL1xuJGJyZWFrcG9pbnRzOiAoXG4gIG1vYmlsZTogODAwcHgsXG4gIGRlc2t0b3A6IDEyMDBweCxcbik7XG5cbiRtb2JpbGU6IFwiKG1heC13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX0pXCI7XG4kdGFibGV0OiBcIihtaW4td2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9KSBhbmQgKG1heC13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgZGVza3RvcCl9KVwiO1xuJGRlc2t0b3A6IFwiKG1pbi13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgZGVza3RvcCl9KVwiO1xuXG4kcGFnZVdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfTtcbiRzaWRlUGFuZWxXaWR0aDogMzIwcHg7IC8vMzgwcHg7XG4kdG9wU3BhY2luZzogNnJlbTtcbiRib2xkV2VpZ2h0OiA3MDA7XG4kc2VtaUJvbGRXZWlnaHQ6IDYwMDtcbiRub3JtYWxXZWlnaHQ6IDQwMDtcblxuJG1vYmlsZUdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiYXV0b1wiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdFwiXFxcbiAgICAgIFwiZ3JpZC1oZWFkZXJcIlxcXG4gICAgICBcImdyaWQtY2VudGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtZm9vdGVyXCInLFxuKTtcbiR0YWJsZXRHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCIjeyRzaWRlUGFuZWxXaWR0aH0gYXV0b1wiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWhlYWRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1jZW50ZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1mb290ZXJcIicsXG4pO1xuJGRlc2t0b3BHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiI3skc2lkZVBhbmVsV2lkdGh9IGF1dG8gI3skc2lkZVBhbmVsV2lkdGh9XCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtaGVhZGVyIGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1jZW50ZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWZvb3RlciBncmlkLXNpZGViYXItcmlnaHRcIicsXG4pO1xuIiwiY29kZVtkYXRhLXRoZW1lKj1cIiBcIl0ge1xuICBjb2xvcjogdmFyKC0tc2hpa2ktbGlnaHQpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlraS1saWdodC1iZyk7XG59XG5cbmNvZGVbZGF0YS10aGVtZSo9XCIgXCJdIHNwYW4ge1xuICBjb2xvcjogdmFyKC0tc2hpa2ktbGlnaHQpO1xufVxuXG5bc2F2ZWQtdGhlbWU9XCJkYXJrXCJdIGNvZGVbZGF0YS10aGVtZSo9XCIgXCJdIHtcbiAgY29sb3I6IHZhcigtLXNoaWtpLWRhcmspO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlraS1kYXJrLWJnKTtcbn1cblxuW3NhdmVkLXRoZW1lPVwiZGFya1wiXSBjb2RlW2RhdGEtdGhlbWUqPVwiIFwiXSBzcGFuIHtcbiAgY29sb3I6IHZhcigtLXNoaWtpLWRhcmspO1xufVxuIiwiQHVzZSBcIi4vdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuQHVzZSBcInNhc3M6Y29sb3JcIjtcblxuLmNhbGxvdXQge1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZyk7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgcGFkZGluZzogMCAxcmVtO1xuICBvdmVyZmxvdy15OiBoaWRkZW47XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgJiA+IC5jYWxsb3V0LWNvbnRlbnQge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgdHJhbnNpdGlvbjogZ3JpZC10ZW1wbGF0ZS1yb3dzIDAuMXMgY3ViaWMtYmV6aWVyKDAuMDIsIDAuMDEsIDAuNDcsIDEpO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAmID4gOmZpcnN0LWNoaWxkIHtcbiAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgfVxuICB9XG5cbiAgLS1jYWxsb3V0LWljb24tbm90ZTogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGxpbmUgeDE9XCIxOFwiIHkxPVwiMlwiIHgyPVwiMjJcIiB5Mj1cIjZcIj48L2xpbmU+PHBhdGggZD1cIk03LjUgMjAuNSAxOSA5bC00LTRMMy41IDE2LjUgMiAyMnpcIj48L3BhdGg+PC9zdmc+Jyk7XG4gIC0tY2FsbG91dC1pY29uLWFic3RyYWN0OiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCwgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cmVjdCB4PVwiOFwiIHk9XCIyXCIgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiNFwiIHJ4PVwiMVwiIHJ5PVwiMVwiPjwvcmVjdD48cGF0aCBkPVwiTTE2IDRoMmEyIDIgMCAwIDEgMiAydjE0YTIgMiAwIDAgMS0yIDJINmEyIDIgMCAwIDEtMi0yVjZhMiAyIDAgMCAxIDItMmgyXCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTIgMTFoNFwiPjwvcGF0aD48cGF0aCBkPVwiTTEyIDE2aDRcIj48L3BhdGg+PHBhdGggZD1cIk04IDExaC4wMVwiPjwvcGF0aD48cGF0aCBkPVwiTTggMTZoLjAxXCI+PC9wYXRoPjwvc3ZnPicpO1xuICAtLWNhbGxvdXQtaWNvbi1pbmZvOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCwgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCI+PC9jaXJjbGU+PGxpbmUgeDE9XCIxMlwiIHkxPVwiMTZcIiB4Mj1cIjEyXCIgeTI9XCIxMlwiPjwvbGluZT48bGluZSB4MT1cIjEyXCIgeTE9XCI4XCIgeDI9XCIxMi4wMVwiIHkyPVwiOFwiPjwvbGluZT48L3N2Zz4nKTtcbiAgLS1jYWxsb3V0LWljb24tdG9kbzogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0xMiAyMmM1LjUyMyAwIDEwLTQuNDc3IDEwLTEwUzE3LjUyMyAyIDEyIDIgMiA2LjQ3NyAyIDEyczQuNDc3IDEwIDEwIDEwelwiPjwvcGF0aD48cGF0aCBkPVwibTkgMTIgMiAyIDQtNFwiPjwvcGF0aD48L3N2Zz4nKTtcbiAgLS1jYWxsb3V0LWljb24tdGlwOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNOC41IDE0LjVBMi41IDIuNSAwIDAgMCAxMSAxMmMwLTEuMzgtLjUtMi0xLTMtMS4wNzItMi4xNDMtLjIyNC00LjA1NCAyLTYgLjUgMi41IDIgNC45IDQgNi41IDIgMS42IDMgMy41IDMgNS41YTcgNyAwIDEgMS0xNCAwYzAtMS4xNTMuNDMzLTIuMjk0IDEtM2EyLjUgMi41IDAgMCAwIDIuNSAyLjV6XCI+PC9wYXRoPjwvc3ZnPiAnKTtcbiAgLS1jYWxsb3V0LWljb24tc3VjY2VzczogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIj48L3BvbHlsaW5lPjwvc3ZnPiAnKTtcbiAgLS1jYWxsb3V0LWljb24tcXVlc3Rpb246IHVybCgnZGF0YTppbWFnZS9zdmcreG1sOyB1dGY4LDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiPjwvY2lyY2xlPjxwYXRoIGQ9XCJNOS4wOSA5YTMgMyAwIDAgMSA1LjgzIDFjMCAyLTMgMy0zIDNcIj48L3BhdGg+PGxpbmUgeDE9XCIxMlwiIHkxPVwiMTdcIiB4Mj1cIjEyLjAxXCIgeTI9XCIxN1wiPjwvbGluZT48L3N2Zz4gJyk7XG4gIC0tY2FsbG91dC1pY29uLXdhcm5pbmc6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sOyB1dGY4LCA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTNaXCI+PC9wYXRoPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjlcIiB4Mj1cIjEyXCIgeTI9XCIxM1wiPjwvbGluZT48bGluZSB4MT1cIjEyXCIgeTE9XCIxN1wiIHgyPVwiMTIuMDFcIiB5Mj1cIjE3XCI+PC9saW5lPjwvc3ZnPicpO1xuICAtLWNhbGxvdXQtaWNvbi1mYWlsdXJlOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxsaW5lIHgxPVwiMThcIiB5MT1cIjZcIiB4Mj1cIjZcIiB5Mj1cIjE4XCI+PC9saW5lPjxsaW5lIHgxPVwiNlwiIHkxPVwiNlwiIHgyPVwiMThcIiB5Mj1cIjE4XCI+PC9saW5lPjwvc3ZnPiAnKTtcbiAgLS1jYWxsb3V0LWljb24tZGFuZ2VyOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwb2x5Z29uIHBvaW50cz1cIjEzIDIgMyAxNCAxMiAxNCAxMSAyMiAyMSAxMCAxMiAxMCAxMyAyXCI+PC9wb2x5Z29uPjwvc3ZnPiAnKTtcbiAgLS1jYWxsb3V0LWljb24tYnVnOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCwgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cmVjdCB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHg9XCI4XCIgeT1cIjZcIiByeD1cIjRcIj48L3JlY3Q+PHBhdGggZD1cIm0xOSA3LTMgMlwiPjwvcGF0aD48cGF0aCBkPVwibTUgNyAzIDJcIj48L3BhdGg+PHBhdGggZD1cIm0xOSAxOS0zLTJcIj48L3BhdGg+PHBhdGggZD1cIm01IDE5IDMtMlwiPjwvcGF0aD48cGF0aCBkPVwiTTIwIDEzaC00XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNCAxM2g0XCI+PC9wYXRoPjxwYXRoIGQ9XCJtMTAgNCAxIDJcIj48L3BhdGg+PHBhdGggZD1cIm0xNCA0LTEgMlwiPjwvcGF0aD48L3N2Zz4nKTtcbiAgLS1jYWxsb3V0LWljb24tZXhhbXBsZTogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48bGluZSB4MT1cIjhcIiB5MT1cIjZcIiB4Mj1cIjIxXCIgeTI9XCI2XCI+PC9saW5lPjxsaW5lIHgxPVwiOFwiIHkxPVwiMTJcIiB4Mj1cIjIxXCIgeTI9XCIxMlwiPjwvbGluZT48bGluZSB4MT1cIjhcIiB5MT1cIjE4XCIgeDI9XCIyMVwiIHkyPVwiMThcIj48L2xpbmU+PGxpbmUgeDE9XCIzXCIgeTE9XCI2XCIgeDI9XCIzLjAxXCIgeTI9XCI2XCI+PC9saW5lPjxsaW5lIHgxPVwiM1wiIHkxPVwiMTJcIiB4Mj1cIjMuMDFcIiB5Mj1cIjEyXCI+PC9saW5lPjxsaW5lIHgxPVwiM1wiIHkxPVwiMThcIiB4Mj1cIjMuMDFcIiB5Mj1cIjE4XCI+PC9saW5lPjwvc3ZnPiAnKTtcbiAgLS1jYWxsb3V0LWljb24tcXVvdGU6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sOyB1dGY4LCA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNMyAyMWMzIDAgNy0xIDctOFY1YzAtMS4yNS0uNzU2LTIuMDE3LTItMkg0Yy0xLjI1IDAtMiAuNzUtMiAxLjk3MlYxMWMwIDEuMjUuNzUgMiAyIDIgMSAwIDEgMCAxIDF2MWMwIDEtMSAyLTIgMnMtMSAuMDA4LTEgMS4wMzFWMjBjMCAxIDAgMSAxIDF6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTUgMjFjMyAwIDctMSA3LThWNWMwLTEuMjUtLjc1Ny0yLjAxNy0yLTJoLTRjLTEuMjUgMC0yIC43NS0yIDEuOTcyVjExYzAgMS4yNS43NSAyIDIgMmguNzVjMCAyLjI1LjI1IDQtMi43NSA0djNjMCAxIDAgMSAxIDF6XCI+PC9wYXRoPjwvc3ZnPicpO1xuICAtLWNhbGxvdXQtaWNvbi1mb2xkOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbCwlM0NzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiUzRSUzQ3BvbHlsaW5lIHBvaW50cz1cIjYgOSAxMiAxNSAxOCA5XCIlM0UlM0MvcG9seWxpbmUlM0UlM0Mvc3ZnJTNFJyk7XG5cbiAgJltkYXRhLWNhbGxvdXRdIHtcbiAgICAtLWNvbG9yOiAjNDQ4YWZmO1xuICAgIC0tYm9yZGVyOiAjNDQ4YWZmNDQ7XG4gICAgLS1iZzogIzQ0OGFmZjEwO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tbm90ZSk7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cImFic3RyYWN0XCJdIHtcbiAgICAtLWNvbG9yOiAjMDBiMGZmO1xuICAgIC0tYm9yZGVyOiAjMDBiMGZmNDQ7XG4gICAgLS1iZzogIzAwYjBmZjEwO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tYWJzdHJhY3QpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJpbmZvXCJdLFxuICAmW2RhdGEtY2FsbG91dD1cInRvZG9cIl0ge1xuICAgIC0tY29sb3I6ICMwMGI4ZDQ7XG4gICAgLS1ib3JkZXI6ICMwMGI4ZDQ0NDtcbiAgICAtLWJnOiAjMDBiOGQ0MTA7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi1pbmZvKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwidG9kb1wiXSB7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi10b2RvKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwidGlwXCJdIHtcbiAgICAtLWNvbG9yOiAjMDBiZmE1O1xuICAgIC0tYm9yZGVyOiAjMDBiZmE1NDQ7XG4gICAgLS1iZzogIzAwYmZhNTEwO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tdGlwKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwic3VjY2Vzc1wiXSB7XG4gICAgLS1jb2xvcjogIzA5YWQ3YTtcbiAgICAtLWJvcmRlcjogIzA5YWQ3MTQ0O1xuICAgIC0tYmc6ICMwOWFkNzExMDtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLXN1Y2Nlc3MpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJxdWVzdGlvblwiXSB7XG4gICAgLS1jb2xvcjogI2RiYTY0MjtcbiAgICAtLWJvcmRlcjogI2RiYTY0MjQ0O1xuICAgIC0tYmc6ICNkYmE2NDIxMDtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLXF1ZXN0aW9uKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwid2FybmluZ1wiXSB7XG4gICAgLS1jb2xvcjogI2RiODk0MjtcbiAgICAtLWJvcmRlcjogI2RiODk0MjQ0O1xuICAgIC0tYmc6ICNkYjg5NDIxMDtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLXdhcm5pbmcpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJmYWlsdXJlXCJdLFxuICAmW2RhdGEtY2FsbG91dD1cImRhbmdlclwiXSxcbiAgJltkYXRhLWNhbGxvdXQ9XCJidWdcIl0ge1xuICAgIC0tY29sb3I6ICNkYjQyNDI7XG4gICAgLS1ib3JkZXI6ICNkYjQyNDI0NDtcbiAgICAtLWJnOiAjZGI0MjQyMTA7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi1mYWlsdXJlKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwiYnVnXCJdIHtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLWJ1Zyk7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cImRhbmdlclwiXSB7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi1kYW5nZXIpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJleGFtcGxlXCJdIHtcbiAgICAtLWNvbG9yOiAjN2E0M2I1O1xuICAgIC0tYm9yZGVyOiAjN2E0M2I1NDQ7XG4gICAgLS1iZzogIzdhNDNiNTEwO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tZXhhbXBsZSk7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cInF1b3RlXCJdIHtcbiAgICAtLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICAgIC0tYm9yZGVyOiB2YXIoLS1saWdodGdyYXkpO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tcXVvdGUpO1xuICB9XG5cbiAgJi5pcy1jb2xsYXBzZWQge1xuICAgICYgPiAuY2FsbG91dC10aXRsZSA+IC5mb2xkLWNhbGxvdXQtaWNvbiB7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZVooLTkwZGVnKTtcbiAgICB9XG5cbiAgICAuY2FsbG91dC1jb250ZW50IHtcbiAgICAgICYgPiAqIHtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICBoZWlnaHQgMC4xcyBjdWJpYy1iZXppZXIoMC4wMiwgMC4wMSwgMC40NywgMSksXG4gICAgICAgICAgbWFyZ2luIDAuMXMgY3ViaWMtYmV6aWVyKDAuMDIsIDAuMDEsIDAuNDcsIDEpLFxuICAgICAgICAgIHBhZGRpbmcgMC4xcyBjdWJpYy1iZXppZXIoMC4wMiwgMC4wMSwgMC40NywgMSk7XG4gICAgICAgIG92ZXJmbG93LXk6IGNsaXA7XG4gICAgICAgIGhlaWdodDogMDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICAgICAgbWFyZ2luLXRvcDogMDtcbiAgICAgICAgcGFkZGluZy1ib3R0b206IDA7XG4gICAgICAgIHBhZGRpbmctdG9wOiAwO1xuICAgICAgfVxuICAgICAgJiA+IDpmaXJzdC1jaGlsZCB7XG4gICAgICAgIG1hcmdpbi10b3A6IC0xcmVtO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4uY2FsbG91dC10aXRsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBnYXA6IDVweDtcbiAgcGFkZGluZzogMXJlbSAwO1xuICBjb2xvcjogdmFyKC0tY29sb3IpO1xuXG4gIC0taWNvbi1zaXplOiAxOHB4O1xuXG4gICYgLmZvbGQtY2FsbG91dC1pY29uIHtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4xNXMgZWFzZTtcbiAgICBvcGFjaXR5OiAwLjg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tZm9sZCk7XG4gIH1cblxuICAmID4gLmNhbGxvdXQtdGl0bGUtaW5uZXIgPiBwIHtcbiAgICBjb2xvcjogdmFyKC0tY29sb3IpO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuXG4gIC5jYWxsb3V0LWljb24sXG4gICYgLmZvbGQtY2FsbG91dC1pY29uIHtcbiAgICB3aWR0aDogdmFyKC0taWNvbi1zaXplKTtcbiAgICBoZWlnaHQ6IHZhcigtLWljb24tc2l6ZSk7XG4gICAgZmxleDogMCAwIHZhcigtLWljb24tc2l6ZSk7XG5cbiAgICAvLyBpY29uIHN1cHBvcnRcbiAgICBiYWNrZ3JvdW5kLXNpemU6IHZhcigtLWljb24tc2l6ZSkgdmFyKC0taWNvbi1zaXplKTtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3IpO1xuICAgIG1hc2staW1hZ2U6IHZhcigtLWNhbGxvdXQtaWNvbik7XG4gICAgbWFzay1zaXplOiB2YXIoLS1pY29uLXNpemUpIHZhcigtLWljb24tc2l6ZSk7XG4gICAgbWFzay1wb3NpdGlvbjogY2VudGVyO1xuICAgIG1hc2stcmVwZWF0OiBuby1yZXBlYXQ7XG4gICAgcGFkZGluZzogMC4ycmVtIDA7XG4gIH1cblxuICAuY2FsbG91dC10aXRsZS1pbm5lciB7XG4gICAgZm9udC13ZWlnaHQ6ICRzZW1pQm9sZFdlaWdodDtcbiAgfVxufVxuIiwiQHVzZSBcInNhc3M6bWFwXCI7XG5cbkB1c2UgXCIuL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcbkB1c2UgXCIuL3N5bnRheC5zY3NzXCI7XG5AdXNlIFwiLi9jYWxsb3V0cy5zY3NzXCI7XG5cbmh0bWwge1xuICBzY3JvbGwtYmVoYXZpb3I6IHNtb290aDtcbiAgdGV4dC1zaXplLWFkanVzdDogbm9uZTtcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICB3aWR0aDogMTAwdnc7XG5cbiAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICBzY3JvbGwtcGFkZGluZy10b3A6IDRyZW07XG4gIH1cbn1cblxuYm9keSB7XG4gIG1hcmdpbjogMDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICBmb250LWZhbWlseTogdmFyKC0tYm9keUZvbnQpO1xuICBjb2xvcjogdmFyKC0tZGFya2dyYXkpO1xufVxuXG4udGV4dC1oaWdobGlnaHQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXh0SGlnaGxpZ2h0KTtcbiAgcGFkZGluZzogMCAwLjFyZW07XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbn1cbjo6c2VsZWN0aW9uIHtcbiAgYmFja2dyb3VuZDogY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXRlcnRpYXJ5KSA2MCUsIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCkpO1xuICBjb2xvcjogdmFyKC0tZGFya2dyYXkpO1xufVxuXG5wLFxudWwsXG50ZXh0LFxuYSxcbnRyLFxudGQsXG5saSxcbm9sLFxudWwsXG4ua2F0ZXgsXG4ubWF0aCxcbi50eXBzdC1kb2MsXG5nW2NsYXNzfj1cInR5cHN0LXRleHRcIl0ge1xuICBjb2xvcjogdmFyKC0tZGFya2dyYXkpO1xuICBmaWxsOiB2YXIoLS1kYXJrZ3JheSk7XG4gIG92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XG4gIHRleHQtd3JhcDogcHJldHR5O1xufVxuXG5wYXRoW2NsYXNzfj1cInR5cHN0LXNoYXBlXCJdIHtcbiAgc3Ryb2tlOiB2YXIoLS1kYXJrZ3JheSk7XG59XG5cbi5tYXRoIHtcbiAgJi5tYXRoLWRpc3BsYXkge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgfVxufVxuXG5hcnRpY2xlIHtcbiAgPiBtangtY29udGFpbmVyLk1hdGhKYXgsXG4gIGJsb2NrcXVvdGUgPiBkaXYgPiBtangtY29udGFpbmVyLk1hdGhKYXgge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgPiBzdmcge1xuICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgfVxuICB9XG4gIGJsb2NrcXVvdGUgPiBkaXYgPiBtangtY29udGFpbmVyLk1hdGhKYXggPiBzdmcge1xuICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgfVxufVxuXG5zdHJvbmcge1xuICBmb250LXdlaWdodDogJHNlbWlCb2xkV2VpZ2h0O1xufVxuXG5hIHtcbiAgZm9udC13ZWlnaHQ6ICRzZW1pQm9sZFdlaWdodDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIGVhc2U7XG4gIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuXG4gICY6aG92ZXIge1xuICAgIGNvbG9yOiB2YXIoLS10ZXJ0aWFyeSk7XG4gIH1cblxuICAmLmludGVybmFsIHtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGlnaGxpZ2h0KTtcbiAgICBwYWRkaW5nOiAwIDAuMXJlbTtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgbGluZS1oZWlnaHQ6IDEuNHJlbTtcblxuICAgICYuYnJva2VuIHtcbiAgICAgIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICAgICAgb3BhY2l0eTogMC41O1xuICAgICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjJzIGVhc2U7XG4gICAgICAmOmhvdmVyIHtcbiAgICAgICAgb3BhY2l0eTogMC44O1xuICAgICAgfVxuICAgIH1cblxuICAgICY6aGFzKD4gaW1nKSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgIH1cbiAgICAmLnRhZy1saW5rIHtcbiAgICAgICY6OmJlZm9yZSB7XG4gICAgICAgIGNvbnRlbnQ6IFwiI1wiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICYuZXh0ZXJuYWwgLmV4dGVybmFsLWljb24ge1xuICAgIGhlaWdodDogMWV4O1xuICAgIG1hcmdpbjogMCAwLjE1ZW07XG5cbiAgICA+IHBhdGgge1xuICAgICAgZmlsbDogdmFyKC0tZGFyayk7XG4gICAgfVxuICB9XG59XG5cbi5mbGV4LWNvbXBvbmVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5cbi5kZXNrdG9wLW9ubHkge1xuICBkaXNwbGF5OiBpbml0aWFsO1xuICAmLmZsZXgtY29tcG9uZW50IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICB9XG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgJi5mbGV4LWNvbXBvbmVudCB7XG4gICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG5cbi5tb2JpbGUtb25seSB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gICYuZmxleC1jb21wb25lbnQge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICAmLmZsZXgtY29tcG9uZW50IHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuICAgIGRpc3BsYXk6IGluaXRpYWw7XG4gIH1cbn1cblxuLnBhZ2Uge1xuICBtYXgtd2lkdGg6IGNhbGMoI3ttYXAuZ2V0KCRicmVha3BvaW50cywgZGVza3RvcCl9ICsgMzAwcHgpO1xuICBtYXJnaW46IDAgYXV0bztcbiAgJiBhcnRpY2xlIHtcbiAgICAmID4gaDEge1xuICAgICAgZm9udC1zaXplOiAycmVtO1xuICAgIH1cblxuICAgICYgbGk6aGFzKD4gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdKSB7XG4gICAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XG4gICAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgfVxuXG4gICAgJiBsaTpoYXMoPiBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCkge1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBsaW5lLXRocm91Z2g7XG4gICAgICB0ZXh0LWRlY29yYXRpb24tY29sb3I6IHZhcigtLWdyYXkpO1xuICAgICAgY29sb3I6IHZhcigtLWdyYXkpO1xuICAgIH1cblxuICAgICYgbGkgPiAqIHtcbiAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgIH1cblxuICAgIHAgPiBzdHJvbmcge1xuICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgIH1cbiAgfVxuXG4gICYgPiAjcXVhcnR6LWJvZHkge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAje21hcC5nZXQoJGRlc2t0b3BHcmlkLCB0ZW1wbGF0ZUNvbHVtbnMpfTtcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6ICN7bWFwLmdldCgkZGVza3RvcEdyaWQsIHRlbXBsYXRlUm93cyl9O1xuICAgIGNvbHVtbi1nYXA6ICN7bWFwLmdldCgkZGVza3RvcEdyaWQsIGNvbHVtbkdhcCl9O1xuICAgIHJvdy1nYXA6ICN7bWFwLmdldCgkZGVza3RvcEdyaWQsIHJvd0dhcCl9O1xuICAgIGdyaWQtdGVtcGxhdGUtYXJlYXM6ICN7bWFwLmdldCgkZGVza3RvcEdyaWQsIHRlbXBsYXRlQXJlYXMpfTtcblxuICAgIEBtZWRpYSBhbGwgYW5kICgkdGFibGV0KSB7XG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6ICN7bWFwLmdldCgkdGFibGV0R3JpZCwgdGVtcGxhdGVDb2x1bW5zKX07XG4gICAgICBncmlkLXRlbXBsYXRlLXJvd3M6ICN7bWFwLmdldCgkdGFibGV0R3JpZCwgdGVtcGxhdGVSb3dzKX07XG4gICAgICBjb2x1bW4tZ2FwOiAje21hcC5nZXQoJHRhYmxldEdyaWQsIGNvbHVtbkdhcCl9O1xuICAgICAgcm93LWdhcDogI3ttYXAuZ2V0KCR0YWJsZXRHcmlkLCByb3dHYXApfTtcbiAgICAgIGdyaWQtdGVtcGxhdGUtYXJlYXM6ICN7bWFwLmdldCgkdGFibGV0R3JpZCwgdGVtcGxhdGVBcmVhcyl9O1xuICAgIH1cbiAgICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAje21hcC5nZXQoJG1vYmlsZUdyaWQsIHRlbXBsYXRlQ29sdW1ucyl9O1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAje21hcC5nZXQoJG1vYmlsZUdyaWQsIHRlbXBsYXRlUm93cyl9O1xuICAgICAgY29sdW1uLWdhcDogI3ttYXAuZ2V0KCRtb2JpbGVHcmlkLCBjb2x1bW5HYXApfTtcbiAgICAgIHJvdy1nYXA6ICN7bWFwLmdldCgkbW9iaWxlR3JpZCwgcm93R2FwKX07XG4gICAgICBncmlkLXRlbXBsYXRlLWFyZWFzOiAje21hcC5nZXQoJG1vYmlsZUdyaWQsIHRlbXBsYXRlQXJlYXMpfTtcbiAgICB9XG5cbiAgICBAbWVkaWEgYWxsIGFuZCBub3QgKCRkZXNrdG9wKSB7XG4gICAgICBwYWRkaW5nOiAwIDFyZW07XG4gICAgfVxuICAgIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgICBtYXJnaW46IDAgYXV0bztcbiAgICB9XG5cbiAgICAmIC5zaWRlYmFyIHtcbiAgICAgIGdhcDogMS4ycmVtO1xuICAgICAgdG9wOiAwO1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIHBhZGRpbmc6ICR0b3BTcGFjaW5nIDJyZW0gMnJlbSAycmVtO1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGhlaWdodDogMTAwdmg7XG4gICAgICBwb3NpdGlvbjogc3RpY2t5O1xuICAgIH1cblxuICAgICYgLnNpZGViYXIubGVmdCB7XG4gICAgICB6LWluZGV4OiAxO1xuICAgICAgZ3JpZC1hcmVhOiBncmlkLXNpZGViYXItbGVmdDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICAgICBnYXA6IDA7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHBvc2l0aW9uOiBpbml0aWFsO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBoZWlnaHQ6IHVuc2V0O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICBwYWRkaW5nLXRvcDogMnJlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAmIC5zaWRlYmFyLnJpZ2h0IHtcbiAgICAgIGdyaWQtYXJlYTogZ3JpZC1zaWRlYmFyLXJpZ2h0O1xuICAgICAgbWFyZ2luLXJpZ2h0OiAwO1xuICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiBpbmhlcml0O1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IGluaGVyaXQ7XG4gICAgICB9XG4gICAgICBAbWVkaWEgYWxsIGFuZCBub3QgKCRkZXNrdG9wKSB7XG4gICAgICAgIHBvc2l0aW9uOiBpbml0aWFsO1xuICAgICAgICBoZWlnaHQ6IHVuc2V0O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgJiA+ICoge1xuICAgICAgICAgIGZsZXg6IDE7XG4gICAgICAgICAgbWF4LWhlaWdodDogMjRyZW07XG4gICAgICAgIH1cbiAgICAgICAgJiA+IC50b2Mge1xuICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgJiAucGFnZS1oZWFkZXIsXG4gICAgJiAucGFnZS1mb290ZXIge1xuICAgICAgbWFyZ2luLXRvcDogMXJlbTtcbiAgICB9XG5cbiAgICAmIC5wYWdlLWhlYWRlciB7XG4gICAgICBncmlkLWFyZWE6IGdyaWQtaGVhZGVyO1xuICAgICAgbWFyZ2luOiAkdG9wU3BhY2luZyAwIDAgMDtcbiAgICAgIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJiAuY2VudGVyID4gYXJ0aWNsZSB7XG4gICAgICBncmlkLWFyZWE6IGdyaWQtY2VudGVyO1xuICAgIH1cblxuICAgICYgZm9vdGVyIHtcbiAgICAgIGdyaWQtYXJlYTogZ3JpZC1mb290ZXI7XG4gICAgfVxuXG4gICAgJiAuY2VudGVyLFxuICAgICYgZm9vdGVyIHtcbiAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICAgIG1pbi13aWR0aDogMTAwJTtcbiAgICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICAgICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuICAgICAgQG1lZGlhIGFsbCBhbmQgKCR0YWJsZXQpIHtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAwO1xuICAgICAgfVxuICAgICAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAwO1xuICAgICAgICBtYXJnaW4tbGVmdDogMDtcbiAgICAgIH1cbiAgICB9XG4gICAgJiBmb290ZXIge1xuICAgICAgbWFyZ2luLWxlZnQ6IDA7XG4gICAgfVxuICB9XG59XG5cbi5mb290bm90ZXMge1xuICBtYXJnaW4tdG9wOiAycmVtO1xuICBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbn1cblxuaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDJweCk7XG4gIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0KTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBtYXJnaW4taW5saW5lLWVuZDogMC4ycmVtO1xuICBtYXJnaW4taW5saW5lLXN0YXJ0OiAtMS40cmVtO1xuICBhcHBlYXJhbmNlOiBub25lO1xuICB3aWR0aDogMTZweDtcbiAgaGVpZ2h0OiAxNnB4O1xuXG4gICY6Y2hlY2tlZCB7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG5cbiAgICAmOjphZnRlciB7XG4gICAgICBjb250ZW50OiBcIlwiO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgbGVmdDogNHB4O1xuICAgICAgdG9wOiAxcHg7XG4gICAgICB3aWR0aDogNHB4O1xuICAgICAgaGVpZ2h0OiA4cHg7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIGJvcmRlcjogc29saWQgdmFyKC0tbGlnaHQpO1xuICAgICAgYm9yZGVyLXdpZHRoOiAwIDJweCAycHggMDtcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKTtcbiAgICB9XG4gIH1cbn1cblxuYmxvY2txdW90ZSB7XG4gIG1hcmdpbjogMXJlbSAwO1xuICBib3JkZXItbGVmdDogM3B4IHNvbGlkIHZhcigtLXNlY29uZGFyeSk7XG4gIHBhZGRpbmctbGVmdDogMXJlbTtcbiAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuMnMgZWFzZTtcbn1cblxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2LFxudGhlYWQge1xuICBmb250LWZhbWlseTogdmFyKC0taGVhZGVyRm9udCk7XG4gIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgZm9udC13ZWlnaHQ6IHJldmVydDtcbiAgbWFyZ2luLWJvdHRvbTogMDtcblxuICBhcnRpY2xlID4gJiA+IGFbcm9sZT1cImFuY2hvclwiXSB7XG4gICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICB9XG59XG5cbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNiB7XG4gICZbaWRdID4gYVtocmVmXj1cIiNcIl0ge1xuICAgIG1hcmdpbjogMCAwLjVyZW07XG4gICAgb3BhY2l0eTogMDtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMnMgZWFzZTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTAuMXJlbSk7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWNvZGVGb250KTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxuXG4gICZbaWRdOmhvdmVyID4gYSB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuXG4gICY6bm90KFtpZF0pID4gYVtyb2xlPVwiYW5jaG9yXCJdIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG5cbi8vIHR5cG9ncmFwaHkgaW1wcm92ZW1lbnRzXG5oMSB7XG4gIGZvbnQtc2l6ZTogMS43NXJlbTtcbiAgbWFyZ2luLXRvcDogMi4yNXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cblxuaDIge1xuICBmb250LXNpemU6IDEuNHJlbTtcbiAgbWFyZ2luLXRvcDogMS45cmVtO1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuXG5oMyB7XG4gIGZvbnQtc2l6ZTogMS4xMnJlbTtcbiAgbWFyZ2luLXRvcDogMS42MnJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cblxuaDQsXG5oNSxcbmg2IHtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBtYXJnaW4tdG9wOiAxLjVyZW07XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG5cbmZpZ3VyZVtkYXRhLXJlaHlwZS1wcmV0dHktY29kZS1maWd1cmVdIHtcbiAgbWFyZ2luOiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGxpbmUtaGVpZ2h0OiAxLjZyZW07XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAmID4gW2RhdGEtcmVoeXBlLXByZXR0eS1jb2RlLXRpdGxlXSB7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWNvZGVGb250KTtcbiAgICBmb250LXNpemU6IDAuOXJlbTtcbiAgICBwYWRkaW5nOiAwLjFyZW0gMC41cmVtO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICBtYXJnaW4tYm90dG9tOiAtMC41cmVtO1xuICAgIGNvbG9yOiB2YXIoLS1kYXJrZ3JheSk7XG4gIH1cblxuICAmID4gcHJlIHtcbiAgICBwYWRkaW5nOiAwO1xuICB9XG59XG5cbnByZSB7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1jb2RlRm9udCk7XG4gIHBhZGRpbmc6IDAgMC41cmVtO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIG92ZXJmbG93LXg6IGF1dG87XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAmOmhhcyg+IGNvZGUubWVybWFpZCkge1xuICAgIGJvcmRlcjogbm9uZTtcbiAgfVxuXG4gICYgPiBjb2RlIHtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgZm9udC1zaXplOiAwLjg1cmVtO1xuICAgIGNvdW50ZXItcmVzZXQ6IGxpbmU7XG4gICAgY291bnRlci1pbmNyZW1lbnQ6IGxpbmUgMDtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIHBhZGRpbmc6IDAuNXJlbSAwO1xuICAgIG92ZXJmbG93LXg6IGF1dG87XG5cbiAgICAmIFtkYXRhLWhpZ2hsaWdodGVkLWNoYXJzXSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1oaWdobGlnaHQpO1xuICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIH1cblxuICAgICYgPiBbZGF0YS1saW5lXSB7XG4gICAgICBwYWRkaW5nOiAwIDAuMjVyZW07XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCB0cmFuc3BhcmVudDtcblxuICAgICAgJltkYXRhLWhpZ2hsaWdodGVkLWxpbmVdIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGlnaGxpZ2h0KTtcbiAgICAgICAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnkpO1xuICAgICAgfVxuXG4gICAgICAmOjpiZWZvcmUge1xuICAgICAgICBjb250ZW50OiBjb3VudGVyKGxpbmUpO1xuICAgICAgICBjb3VudGVyLWluY3JlbWVudDogbGluZTtcbiAgICAgICAgd2lkdGg6IDFyZW07XG4gICAgICAgIG1hcmdpbi1yaWdodDogMXJlbTtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICAgICAgY29sb3I6IHJnYmEoMTE1LCAxMzgsIDE0OCwgMC42KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAmW2RhdGEtbGluZS1udW1iZXJzLW1heC1kaWdpdHM9XCIyXCJdID4gW2RhdGEtbGluZV06OmJlZm9yZSB7XG4gICAgICB3aWR0aDogMnJlbTtcbiAgICB9XG5cbiAgICAmW2RhdGEtbGluZS1udW1iZXJzLW1heC1kaWdpdHM9XCIzXCJdID4gW2RhdGEtbGluZV06OmJlZm9yZSB7XG4gICAgICB3aWR0aDogM3JlbTtcbiAgICB9XG4gIH1cbn1cblxuY29kZSB7XG4gIGZvbnQtc2l6ZTogMC45ZW07XG4gIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWNvZGVGb250KTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBwYWRkaW5nOiAwLjFyZW0gMC4ycmVtO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodGdyYXkpO1xufVxuXG50Ym9keSxcbmxpLFxucCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjZyZW07XG59XG5cbi50YWJsZS1jb250YWluZXIge1xuICBvdmVyZmxvdy14OiBhdXRvO1xuXG4gICYgPiB0YWJsZSB7XG4gICAgbWFyZ2luOiAxcmVtO1xuICAgIHBhZGRpbmc6IDEuNXJlbTtcbiAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuXG4gICAgdGgsXG4gICAgdGQge1xuICAgICAgbWluLXdpZHRoOiA3NXB4O1xuICAgIH1cblxuICAgICYgPiAqIHtcbiAgICAgIGxpbmUtaGVpZ2h0OiAycmVtO1xuICAgIH1cbiAgfVxufVxuXG50aCB7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIHBhZGRpbmc6IDAuNHJlbSAwLjdyZW07XG4gIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCB2YXIoLS1ncmF5KTtcbn1cblxudGQge1xuICBwYWRkaW5nOiAwLjJyZW0gMC43cmVtO1xufVxuXG50ciB7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAmOmxhc3QtY2hpbGQge1xuICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG4gIH1cbn1cblxuaW1nIHtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIG1hcmdpbjogMXJlbSAwO1xuICBjb250ZW50LXZpc2liaWxpdHk6IGF1dG87XG59XG5cbnAgPiBpbWcgKyBlbSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTFyZW0pO1xufVxuXG5ociB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW46IDJyZW0gYXV0bztcbiAgaGVpZ2h0OiAxcHg7XG4gIGJvcmRlcjogbm9uZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHRncmF5KTtcbn1cblxuYXVkaW8sXG52aWRlbyB7XG4gIHdpZHRoOiAxMDAlO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG59XG5cbi5zcGFjZXIge1xuICBmbGV4OiAyIDEgYXV0bztcbn1cblxuZGl2Omhhcyg+IC5vdmVyZmxvdykge1xuICBtYXgtaGVpZ2h0OiAxMDAlO1xuICBvdmVyZmxvdy15OiBoaWRkZW47XG59XG5cbnVsLm92ZXJmbG93LFxub2wub3ZlcmZsb3cge1xuICBtYXgtaGVpZ2h0OiAxMDAlO1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICB3aWR0aDogMTAwJTtcbiAgbWFyZ2luLWJvdHRvbTogMDtcblxuICAvLyBjbGVhcmZpeFxuICBjb250ZW50OiBcIlwiO1xuICBjbGVhcjogYm90aDtcblxuICAmID4gbGkub3ZlcmZsb3ctZW5kIHtcbiAgICBoZWlnaHQ6IDAuNXJlbTtcbiAgICBtYXJnaW46IDA7XG4gIH1cblxuICAmLmdyYWRpZW50LWFjdGl2ZSB7XG4gICAgbWFzay1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgYmxhY2sgY2FsYygxMDAlIC0gNTBweCksIHRyYW5zcGFyZW50IDEwMCUpO1xuICB9XG59XG5cbi50cmFuc2NsdWRlIHtcbiAgdWwge1xuICAgIHBhZGRpbmctbGVmdDogMXJlbTtcbiAgfVxufVxuXG4ua2F0ZXgtZGlzcGxheSB7XG4gIGRpc3BsYXk6IGluaXRpYWw7XG4gIG92ZXJmbG93LXg6IGF1dG87XG4gIG92ZXJmbG93LXk6IGhpZGRlbjtcbn1cblxuLmV4dGVybmFsLWVtYmVkLnlvdXR1YmUsXG5pZnJhbWUucGRmIHtcbiAgYXNwZWN0LXJhdGlvOiAxNiAvIDk7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbn1cblxuLm5hdmlnYXRpb24tcHJvZ3Jlc3Mge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDA7XG4gIGhlaWdodDogM3B4O1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1zZWNvbmRhcnkpO1xuICB0cmFuc2l0aW9uOiB3aWR0aCAwLjJzIGVhc2U7XG4gIHotaW5kZXg6IDk5OTk7XG59XG4iLCJAdXNlIFwiLi9iYXNlLnNjc3NcIjtcblxuLyogPT09PT0g5qC55a655Zmo5pKR5ruh5bGP5bmVID09PT09ICovXG4jcXVhcnR6LXJvb3Qge1xuICBtYXgtd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgcGFkZGluZzogMCAhaW1wb3J0YW50O1xuICBtYXJnaW46IDAgIWltcG9ydGFudDtcbn1cblxuLyogPT09PT0g6IOM5pmvICsg5p6B5reh5YWJ5pmVICsg5b6u5qih57OKID09PT09ICovXG5odG1sLCBib2R5IHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCdzdGF0aWMvYnAuanBnJykgIWltcG9ydGFudDtcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICBiYWNrZ3JvdW5kLWF0dGFjaG1lbnQ6IGZpeGVkO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTtcbn1cbmJvZHk6OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDA7IGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQ6XG4gICAgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAzMCUgNDAlLCByZ2JhKDEzMCwxNzAsMjMwLDAuMjUpIDAlLCB0cmFuc3BhcmVudCA1NSUpLFxuICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNzAlIDYwJSwgcmdiYSgxODAsMTQwLDIyMCwwLjE1KSAwJSwgdHJhbnNwYXJlbnQgNTUlKTtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDJweCk7XG4gIHotaW5kZXg6IC0xO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cbi5kYXJrIGJvZHk6OmFmdGVyIHtcbiAgYmFja2dyb3VuZDpcbiAgICByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDMwJSA0MCUsIHJnYmEoODAsMTIwLDIwMCwwLjMpIDAlLCB0cmFuc3BhcmVudCA1NSUpLFxuICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNzAlIDYwJSwgcmdiYSgxMjAsOTAsMTgwLDAuMikgMCUsIHRyYW5zcGFyZW50IDU1JSk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigycHgpO1xufVxuXG4vKiA9PT09PSDkvqfovrnmoI/lrrnlmajvvJrku4Xlr7kgc2lkZWJhciDoh6rouqvlkoznm7TmjqXlrZDlhYPntKDljrvog4zmma8gPT09PT0gKi9cbiNxdWFydHotcm9vdCAubGVmdCxcbiNxdWFydHotcm9vdCAucmlnaHQge1xuICBwb3NpdGlvbjogc3RpY2t5O1xuICB0b3A6IDA7XG4gIGhlaWdodDogMTAwdmg7XG4gIG92ZXJmbG93LXk6IGF1dG87XG4gIHdpZHRoOiAyNjBweCAhaW1wb3J0YW50O1xuICBmbGV4LXNocmluazogMDtcbiAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDVweCk7XG4gIC13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOiBibHVyKDVweCk7XG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG59XG4uZGFyayAjcXVhcnR6LXJvb3QgLmxlZnQsXG4uZGFyayAjcXVhcnR6LXJvb3QgLnJpZ2h0IHtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDRweCk7XG59XG5cbiNxdWFydHotcm9vdCAubGVmdCA+ICosXG4jcXVhcnR6LXJvb3QgLnJpZ2h0ID4gKixcbiNxdWFydHotcm9vdCAubGVmdCAuZXhwbG9yZXIsXG4jcXVhcnR6LXJvb3QgLmxlZnQgLnNlYXJjaCxcbiNxdWFydHotcm9vdCAubGVmdCAuZGFya21vZGUsXG4jcXVhcnR6LXJvb3QgLmxlZnQgLnBhZ2UtdGl0bGUsXG4jcXVhcnR6LXJvb3QgLnJpZ2h0IC5wcm9maWxlLWNhcmQsXG4jcXVhcnR6LXJvb3QgLmxlZnQgLmZvbGRlci1jb250YWluZXIsXG4jcXVhcnR6LXJvb3QgLmxlZnQgLmZpbGUtdGl0bGUge1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xufVxuXG4jcXVhcnR6LXJvb3QgLmxlZnQgLmV4cGxvcmVyLXRpdGxlLFxuI3F1YXJ0ei1yb290IC5sZWZ0IC5mb2xkZXItdGl0bGUsXG4jcXVhcnR6LXJvb3QgLmxlZnQgLmZpbGUtdGl0bGUsXG4jcXVhcnR6LXJvb3QgLmxlZnQgaW5wdXQsXG4jcXVhcnR6LXJvb3QgLmxlZnQgLnNlYXJjaC1pbnB1dCxcbiNxdWFydHotcm9vdCAubGVmdCAucGFnZS10aXRsZSxcbiNxdWFydHotcm9vdCAubGVmdCAuZGFya21vZGUtY29udGFpbmVyLFxuI3F1YXJ0ei1yb290IC5yaWdodCAucHJvZmlsZS1jYXJkIHtcbiAgcGFkZGluZzogMC4zcmVtIDAuNnJlbSAhaW1wb3J0YW50O1xufVxuI3F1YXJ0ei1yb290IC5sZWZ0ID4gKjpmaXJzdC1jaGlsZCxcbiNxdWFydHotcm9vdCAucmlnaHQgPiAqOmZpcnN0LWNoaWxkIHsgcGFkZGluZy10b3A6IDFyZW0gIWltcG9ydGFudDsgfVxuI3F1YXJ0ei1yb290IC5sZWZ0ID4gKjpsYXN0LWNoaWxkLFxuI3F1YXJ0ei1yb290IC5yaWdodCA+ICo6bGFzdC1jaGlsZCB7IHBhZGRpbmctYm90dG9tOiAxcmVtICFpbXBvcnRhbnQ7IH1cblxuLyogPT09PT0g5bem5L6n5paH5Lu25qCR77ya5bem5YaF6L656Led5a6e546w6KeG6KeJ5bGF5LitID09PT09ICovXG4jcXVhcnR6LXJvb3QgLmxlZnQgLmV4cGxvcmVyIHtcbiAgcGFkZGluZy1sZWZ0OiAyLjVyZW0gIWltcG9ydGFudDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbiNxdWFydHotcm9vdCAubGVmdCAuZm9sZGVyLWNvbnRhaW5lcixcbiNxdWFydHotcm9vdCAubGVmdCAuZmlsZS10aXRsZSB7XG4gIHBhZGRpbmctbGVmdDogMCAhaW1wb3J0YW50O1xuICBtYXJnaW4tbGVmdDogMCAhaW1wb3J0YW50O1xufVxuXG4vKiA9PT09PSDlj7PkvqfkuKrkurrkv6Hmga/ljaHniYcgPT09PT0gKi9cbi5wcm9maWxlLWNhcmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGdhcDogMC41cmVtO1xufVxuLnByb2ZpbGUtYXZhdGFyIHtcbiAgd2lkdGg6IDc1cHg7IGhlaWdodDogNzVweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBvYmplY3QtZml0OiBjb3ZlcjtcbiAgYm9yZGVyOiAycHggc29saWQgcmdiYSg1OCwxMTAsMTY1LDAuNSk7XG4gIGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjEpO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycztcbn1cbi5wcm9maWxlLWF2YXRhcjpob3ZlciB7IHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7IH1cbi5wcm9maWxlLW5hbWUge1xuICBmb250LWZhbWlseTogXCJOb3RvIFNlcmlmIFNDXCIsIHNlcmlmO1xuICBmb250LXNpemU6IDEuMXJlbTsgZm9udC13ZWlnaHQ6IDkwMDtcbiAgY29sb3I6ICMwMDA7XG59XG4uZGFyayAucHJvZmlsZS1uYW1lIHsgY29sb3I6ICM4ZmI5ZjA7IH1cbi5wcm9maWxlLW1vdHRvIHtcbiAgZm9udC1zaXplOiAwLjhyZW07IGNvbG9yOiAjNGE1NTY4O1xuICBmb250LXN0eWxlOiBpdGFsaWM7IGxpbmUtaGVpZ2h0OiAxLjQ7XG59XG4uZGFyayAucHJvZmlsZS1tb3R0byB7IGNvbG9yOiAjYTBhZWMwOyB9XG4ucHJvZmlsZS1uYXYge1xuICBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBnYXA6IDAuNHJlbTtcbiAgbWFyZ2luLXRvcDogMC44cmVtO1xufVxuLnByb2ZpbGUtbmF2IGEge1xuICBjb2xvcjogIzNhNmVhNTsgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBmb250LXNpemU6IDAuODVyZW07IGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGJvcmRlci1ib3R0b206IG5vbmU7IHRyYW5zaXRpb246IGNvbG9yIDAuMnM7XG59XG4ucHJvZmlsZS1uYXYgYTpob3ZlciB7IGNvbG9yOiAjNWQ4ZmMwOyB9XG4uZGFyayAucHJvZmlsZS1uYXYgYSB7IGNvbG9yOiAjNmI5ZmQ0OyB9XG4uZGFyayAucHJvZmlsZS1uYXYgYTpob3ZlciB7IGNvbG9yOiAjOGFiOGU4OyB9XG5cbi8qID09PT09IOWPs+S+p+aWh+eroOebruW9leagt+W8jyA9PT09PSAqL1xuLnJpZ2h0IC50b2Mge1xuICBtYXJnaW4tdG9wOiAxLjVyZW07XG59XG4ucmlnaHQgLnRvYyB1bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmctbGVmdDogMC41cmVtO1xufVxuLnJpZ2h0IC50b2MgbGkge1xuICBtYXJnaW46IDAuM3JlbSAwO1xufVxuLnJpZ2h0IC50b2MgYSB7XG4gIGNvbG9yOiB2YXIoLS1kYXJrZ3JheSk7XG4gIGZvbnQtc2l6ZTogMC45cmVtO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGJvcmRlci1ib3R0b206IG5vbmU7XG59XG4ucmlnaHQgLnRvYyBhOmhvdmVyIHtcbiAgY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG59XG5cbi8qID09PT09IOS4remXtOWGheWuueWMuiA9PT09PSAqL1xuI3F1YXJ0ei1yb290IC5jZW50ZXIge1xuICBmbGV4OiAxO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBwYWRkaW5nOiAycmVtIDIuNXJlbTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgaGVpZ2h0OiBhdXRvO1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xufVxuXG4vKiA9PT09PSDmlofnq6DljaHniYcgPT09PT0gKi9cbi5wYWdlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjc1KTtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDhweCk7XG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gIHBhZGRpbmc6IDIuNXJlbSAzcmVtO1xuICB3aWR0aDogYXV0bztcbiAgbWF4LXdpZHRoOiA4NjBweDtcbiAgYm94LXNoYWRvdzogMCA0cHggMjRweCByZ2JhKDU4LDExMCwxNjUsMC4wNCksXG4gICAgICAgICAgICAgIDAgMCAwIDFweCByZ2JhKDU4LDExMCwxNjUsMC4wNCk7XG59XG4uZGFyayAucGFnZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMzAsNDEsNTksMC43KTtcbiAgYm94LXNoYWRvdzogMCA0cHggMjRweCByZ2JhKDAsMCwwLDAuMiksXG4gICAgICAgICAgICAgIDAgMCAwIDFweCByZ2JhKDEwNywxNTksMjEyLDAuMDYpO1xufVxuXG4ucGFnZSA+IGFydGljbGUsXG4ucGFnZSA+IGFydGljbGUgKiB7XG4gIHRleHQtYWxpZ246IGxlZnQgIWltcG9ydGFudDtcbn1cblxuLyogPT09PT0g5by65YyW5Yqg57KX5pWI5p6cID09PT09ICovXG5zdHJvbmcsIGIge1xuICBmb250LXdlaWdodDogODAwO1xuICBjb2xvcjogIzBhMTQxZjtcbn1cbi5kYXJrIHN0cm9uZywgLmRhcmsgYiB7XG4gIGNvbG9yOiAjZmZmZmZmO1xufVxuXG4vKiA9PT09PSDmraPmlofmjpLniYggPT09PT0gKi9cbmJvZHkge1xuICBmb250LWZhbWlseTogXCJJbnRlclwiLCBcIk5vdG8gU2FucyBTQ1wiLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcbiAgZm9udC1zaXplOiAxLjA4ZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjg7XG4gIGNvbG9yOiAjMWExZTI0ICFpbXBvcnRhbnQ7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG59XG4uZGFyayBib2R5IHsgY29sb3I6ICNlOGVjZjIgIWltcG9ydGFudDsgfVxuXG5oMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcbiAgZm9udC1mYW1pbHk6IFwiTm90byBTZXJpZiBTQ1wiLCBzZXJpZjtcbiAgbGluZS1oZWlnaHQ6IDEuNDtcbiAgbWFyZ2luLXRvcDogMmVtO1xuICBtYXJnaW4tYm90dG9tOiAwLjZlbTtcbn1cbmgxIHsgZm9udC1zaXplOiAxLjhlbTsgY29sb3I6ICMwODM2N2MgIWltcG9ydGFudDsgZm9udC13ZWlnaHQ6IDcwMDsgfVxuaDIgeyBmb250LXNpemU6IDEuNWVtOyBjb2xvcjogIzAwNGZhYSAhaW1wb3J0YW50OyBmb250LXdlaWdodDogNzAwOyB9XG5oMyB7IGZvbnQtc2l6ZTogMS4zZW07IGNvbG9yOiAjMGU2NGJiICFpbXBvcnRhbnQ7IGZvbnQtd2VpZ2h0OiA3MDA7IH1cbmg0IHsgZm9udC1zaXplOiAxLjE1ZW07IGNvbG9yOiAjMzQ4MWM1ICFpbXBvcnRhbnQ7IGZvbnQtd2VpZ2h0OiA2MDA7IH1cbmg1IHsgZm9udC1zaXplOiAxLjA1ZW07IGNvbG9yOiAjNTlhMGUyICFpbXBvcnRhbnQ7IGZvbnQtd2VpZ2h0OiA2MDA7IH1cbmg2IHsgZm9udC1zaXplOiAwLjk1ZW07IGNvbG9yOiAjODhiOGU2ICFpbXBvcnRhbnQ7IGZvbnQtd2VpZ2h0OiA2MDA7IH1cblxuLmRhcmsgaDEgeyBjb2xvcjogIzhmYjlmMCAhaW1wb3J0YW50OyB9XG4uZGFyayBoMiB7IGNvbG9yOiAjN2FhZGU2ICFpbXBvcnRhbnQ7IH1cbi5kYXJrIGgzIHsgY29sb3I6ICM2YTlmZDQgIWltcG9ydGFudDsgfVxuLmRhcmsgaDQgeyBjb2xvcjogIzViOGZjMiAhaW1wb3J0YW50OyB9XG4uZGFyayBoNSB7IGNvbG9yOiAjNGU3ZmIwICFpbXBvcnRhbnQ7IH1cbi5kYXJrIGg2IHsgY29sb3I6ICMzZTZmOWUgIWltcG9ydGFudDsgfVxuXG4uYXJ0aWNsZS10aXRsZSB7XG4gIGZvbnQtc2l6ZTogMmVtOyBjb2xvcjogIzA4MzY3YyAhaW1wb3J0YW50O1xuICBmb250LXdlaWdodDogODAwOyBsaW5lLWhlaWdodDogMS4yO1xuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG59XG4uZGFyayAuYXJ0aWNsZS10aXRsZSB7IGNvbG9yOiAjOGZiOWYwICFpbXBvcnRhbnQ7IH1cblxuYmxvY2txdW90ZSB7XG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWQgIzNhNmVhNTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSg1OCwgMTEwLCAxNjUsIDAuMDUpO1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIHBhZGRpbmc6IDAuOXJlbSAxLjJyZW07XG4gIG1hcmdpbjogMS41cmVtIDA7XG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgY29sb3I6ICMyYzNhNGI7XG59XG4uZGFyayBibG9ja3F1b3RlIHsgYm9yZGVyLWxlZnQtY29sb3I6ICM2YjlmZDQ7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTA3LCAxNTksIDIxMiwgMC4xKTsgY29sb3I6ICNjMGM4ZDQ7IH1cblxuY29kZSB7XG4gIGZvbnQtZmFtaWx5OiBcIkpldEJyYWlucyBNb25vXCIsIG1vbm9zcGFjZTtcbiAgZm9udC1zaXplOiAwLjllbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSg1OCwgMTEwLCAxNjUsIDAuMTIpO1xuICBjb2xvcjogIzJjNTI4MjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBwYWRkaW5nOiAwLjE1ZW0gMC40ZW07XG59XG4uZGFyayBjb2RlIHsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMDcsIDE1OSwgMjEyLCAwLjE1KTsgY29sb3I6ICM4YWI4ZTg7IH1cblxucHJlIHtcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSg1OCwgMTEwLCAxNjUsIDAuMTUpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0NSwgMjQ4LCAyNTIsIDAuNikgIWltcG9ydGFudDtcbiAgcGFkZGluZzogMS4ycmVtIDEuNXJlbTtcbiAgZm9udC1zaXplOiAwLjllbTtcbn1cbi5kYXJrIHByZSB7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4zNSkgIWltcG9ydGFudDsgYm9yZGVyLWNvbG9yOiByZ2JhKDEwNywgMTU5LCAyMTIsIDAuMik7IH1cblxuLnRhZyB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcbiAgcGFkZGluZzogMC4yZW0gMC44ZW07XG4gIGZvbnQtc2l6ZTogMC44ZW07XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoNTgsIDExMCwgMTY1LCAwLjEyKTtcbiAgY29sb3I6ICMyYzUyODI7XG4gIG1hcmdpbi1yaWdodDogMC40ZW07IG1hcmdpbi1ib3R0b206IDAuM2VtO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycztcbn1cbi50YWc6aG92ZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjM2E2ZWE1OyBjb2xvcjogI2ZmZjsgfVxuLmRhcmsgLnRhZyB7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTA3LCAxNTksIDIxMiwgMC4xNSk7IGNvbG9yOiAjOGFiOGU4OyB9XG4uZGFyayAudGFnOmhvdmVyIHsgYmFja2dyb3VuZC1jb2xvcjogIzZiOWZkNDsgY29sb3I6ICNmZmY7IH1cblxuYSB7XG4gIGNvbG9yOiAjM2E2ZWE1OyB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDU4LCAxMTAsIDE2NSwgMC4zKTtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnM7XG59XG5hOmhvdmVyIHsgY29sb3I6ICMyYzUyODI7IGJvcmRlci1ib3R0b20tY29sb3I6ICMyYzUyODI7IH1cbi5kYXJrIGEgeyBjb2xvcjogIzZiOWZkNDsgYm9yZGVyLWJvdHRvbS1jb2xvcjogcmdiYSgxMDcsIDE1OSwgMjEyLCAwLjMpOyB9XG4uZGFyayBhOmhvdmVyIHsgY29sb3I6ICM4YWI4ZTg7IGJvcmRlci1ib3R0b20tY29sb3I6ICM4YWI4ZTg7IH1cblxuOjotd2Via2l0LXNjcm9sbGJhciB7IHdpZHRoOiA2cHg7IH1cbjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sgeyBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLDAuMDIpOyB9XG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHsgYmFja2dyb3VuZDogIzhiOWJiNTsgYm9yZGVyLXJhZGl1czogM3B4OyB9XG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHsgYmFja2dyb3VuZDogIzNhNmVhNTsgfVxuXG46OnNlbGVjdGlvbiB7IGJhY2tncm91bmQ6ICNhMGM0ZTg4ODsgY29sb3I6ICMxZTJhMzY7IH1cbi5kYXJrIDo6c2VsZWN0aW9uIHsgYmFja2dyb3VuZDogIzRhNmE4YTg4OyBjb2xvcjogI2UwZThmMjsgfVxuXG4ucG9wb3Zlcixcbi5zZWFyY2ggPiAuc2VhcmNoLWNvbnRhaW5lciB7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigyMHB4KTtcbiAgLXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6IGJsdXIoMjBweCk7XG59XG5cbi8qID09PT09IOS/neaKpCBnaXNjdXMg6K+E6K665Yy6ID09PT09ICovXG4uZ2lzY3VzLFxuLmdpc2N1cyAqIHtcbiAgYWxsOiB1bnNldCAhaW1wb3J0YW50O1xuICBkaXNwbGF5OiByZXZlcnQgIWltcG9ydGFudDtcbn1cbi5naXNjdXMge1xuICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xuICBtYXgtd2lkdGg6IDg2MHB4O1xuICBtYXJnaW4tdG9wOiAycmVtIGF1dG8gMCBhdXRvICFpbXBvcnRhbnQ7XG59XG4uZ2lzY3VzIGlmcmFtZSB7XG4gIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogYXV0byAhaW1wb3J0YW50O1xuICBtaW4taGVpZ2h0OiA4MDBweCAhaW1wb3J0YW50O1xuICBkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xufVxuXG4vKiDkuK3nrYnlsY/luZXpgILphY0gKi9cbkBtZWRpYSAobWF4LXdpZHRoOiAxNDUwcHgpIHtcbiAgI3F1YXJ0ei1yb290IC5sZWZ0LFxuICAjcXVhcnR6LXJvb3QgLnJpZ2h0IHtcbiAgICB3aWR0aDogMjIwcHggIWltcG9ydGFudDtcbiAgfVxuICAjcXVhcnR6LXJvb3QgLmxlZnQgLmV4cGxvcmVyIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDNyZW0gIWltcG9ydGFudDtcbiAgfVxuICAjcXVhcnR6LXJvb3QgLmNlbnRlciB7XG4gICAgcGFkZGluZzogMnJlbSAxLjVyZW07XG4gIH1cbiAgLnBhZ2Uge1xuICAgIHBhZGRpbmc6IDJyZW0gMnJlbTtcbiAgfVxufVxuXG4vKiDnp7vliqjnq6/pmpDol4/kvqfovrnmoI8gKi9cbkBtZWRpYSAobWF4LXdpZHRoOiAxMjAwcHgpIHtcbiAgI3F1YXJ0ei1yb290IC5sZWZ0LFxuICAjcXVhcnR6LXJvb3QgLnJpZ2h0IHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG4gICNxdWFydHotcm9vdCAuY2VudGVyIHtcbiAgICBwYWRkaW5nOiAycmVtIDEuNXJlbTtcbiAgfVxuICAucGFnZSB7XG4gICAgcGFkZGluZzogMnJlbSAxLjVyZW07XG4gICAgbWF4LXdpZHRoOiAxMDAlO1xuICB9XG59XG5cbi8qIOS/ruWkjeaWh+eroOWIl+ihqOS4remHjeWkjSBoMSDnmoTpl67popggKi9cbi5wYWdlLWxpc3RpbmcgaDEsXG4uc2VjdGlvbi1saSBoMSB7XG4gIGZvbnQtc2l6ZTogMS4yZW07XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG59XG4iXX0= */`;var popover_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
@keyframes dropin {
  0% {
    opacity: 0;
    visibility: hidden;
  }
  1% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
}
.popover {
  z-index: 999;
  position: fixed;
  overflow: visible;
  padding: 1rem;
  left: 0;
  top: 0;
  will-change: transform;
}
.popover > .popover-inner {
  position: relative;
  width: 30rem;
  max-height: 20rem;
  padding: 0 1rem 1rem 1rem;
  font-weight: initial;
  font-style: initial;
  line-height: normal;
  font-size: initial;
  font-family: var(--bodyFont);
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 5px;
  box-shadow: 6px 6px 36px 0 rgba(0, 0, 0, 0.25);
  overflow: auto;
  overscroll-behavior: contain;
  white-space: normal;
  user-select: none;
  cursor: default;
}
.popover > .popover-inner[data-content-type][data-content-type*=pdf], .popover > .popover-inner[data-content-type][data-content-type*=image] {
  padding: 0;
  max-height: 100%;
}
.popover > .popover-inner[data-content-type][data-content-type*=image] img {
  margin: 0;
  border-radius: 0;
  display: block;
}
.popover > .popover-inner[data-content-type][data-content-type*=pdf] iframe {
  width: 100%;
}
.popover h1 {
  font-size: 1.5rem;
}
.popover {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
@media all and ((max-width: 800px)) {
  .popover {
    display: none !important;
  }
}

.active-popover,
.popover:hover {
  animation: dropin 0.3s ease;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2NzcyIsInBvcG92ZXIuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQ0FBO0VBQ0U7SUFDRTtJQUNBOztFQUVGO0lBQ0U7O0VBRUY7SUFDRTtJQUNBOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUlBO0VBRUU7RUFDQTs7QUFJQTtFQUNFO0VBQ0E7RUFDQTs7QUFLRjtFQUNFOztBQUtOO0VBQ0U7O0FBckRKO0VBd0RFO0VBQ0E7RUFDQSxZQUNFOztBQUdGO0VBOURGO0lBK0RJOzs7O0FBSUo7QUFBQTtFQUVFO0VBQ0E7RUFDQSIsInNvdXJjZXNDb250ZW50IjpbIkB1c2UgXCJzYXNzOm1hcFwiO1xuXG4vKipcbiAqIExheW91dCBicmVha3BvaW50c1xuICogJG1vYmlsZTogc2NyZWVuIHdpZHRoIGJlbG93IHRoaXMgdmFsdWUgd2lsbCB1c2UgbW9iaWxlIHN0eWxlc1xuICogJGRlc2t0b3A6IHNjcmVlbiB3aWR0aCBhYm92ZSB0aGlzIHZhbHVlIHdpbGwgdXNlIGRlc2t0b3Agc3R5bGVzXG4gKiBTY3JlZW4gd2lkdGggYmV0d2VlbiAkbW9iaWxlIGFuZCAkZGVza3RvcCB3aWR0aCB3aWxsIHVzZSB0aGUgdGFibGV0IGxheW91dC5cbiAqIGFzc3VtaW5nIG1vYmlsZSA8IGRlc2t0b3BcbiAqL1xuJGJyZWFrcG9pbnRzOiAoXG4gIG1vYmlsZTogODAwcHgsXG4gIGRlc2t0b3A6IDEyMDBweCxcbik7XG5cbiRtb2JpbGU6IFwiKG1heC13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX0pXCI7XG4kdGFibGV0OiBcIihtaW4td2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9KSBhbmQgKG1heC13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgZGVza3RvcCl9KVwiO1xuJGRlc2t0b3A6IFwiKG1pbi13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgZGVza3RvcCl9KVwiO1xuXG4kcGFnZVdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfTtcbiRzaWRlUGFuZWxXaWR0aDogMzIwcHg7IC8vMzgwcHg7XG4kdG9wU3BhY2luZzogNnJlbTtcbiRib2xkV2VpZ2h0OiA3MDA7XG4kc2VtaUJvbGRXZWlnaHQ6IDYwMDtcbiRub3JtYWxXZWlnaHQ6IDQwMDtcblxuJG1vYmlsZUdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiYXV0b1wiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdFwiXFxcbiAgICAgIFwiZ3JpZC1oZWFkZXJcIlxcXG4gICAgICBcImdyaWQtY2VudGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtZm9vdGVyXCInLFxuKTtcbiR0YWJsZXRHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCIjeyRzaWRlUGFuZWxXaWR0aH0gYXV0b1wiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWhlYWRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1jZW50ZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1mb290ZXJcIicsXG4pO1xuJGRlc2t0b3BHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiI3skc2lkZVBhbmVsV2lkdGh9IGF1dG8gI3skc2lkZVBhbmVsV2lkdGh9XCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtaGVhZGVyIGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1jZW50ZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWZvb3RlciBncmlkLXNpZGViYXItcmlnaHRcIicsXG4pO1xuIiwiQHVzZSBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiIGFzICo7XG5cbkBrZXlmcmFtZXMgZHJvcGluIHtcbiAgMCUge1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICB9XG4gIDElIHtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgfVxufVxuXG4ucG9wb3ZlciB7XG4gIHotaW5kZXg6IDk5OTtcbiAgcG9zaXRpb246IGZpeGVkO1xuICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgcGFkZGluZzogMXJlbTtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1xuXG4gICYgPiAucG9wb3Zlci1pbm5lciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHdpZHRoOiAzMHJlbTtcbiAgICBtYXgtaGVpZ2h0OiAyMHJlbTtcbiAgICBwYWRkaW5nOiAwIDFyZW0gMXJlbSAxcmVtO1xuICAgIGZvbnQtd2VpZ2h0OiBpbml0aWFsO1xuICAgIGZvbnQtc3R5bGU6IGluaXRpYWw7XG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgICBmb250LXNpemU6IGluaXRpYWw7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWJvZHlGb250KTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0KTtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgYm94LXNoYWRvdzogNnB4IDZweCAzNnB4IDAgcmdiYSgwLCAwLCAwLCAwLjI1KTtcbiAgICBvdmVyZmxvdzogYXV0bztcbiAgICBvdmVyc2Nyb2xsLWJlaGF2aW9yOiBjb250YWluO1xuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xuICB9XG5cbiAgJiA+IC5wb3BvdmVyLWlubmVyW2RhdGEtY29udGVudC10eXBlXSB7XG4gICAgJltkYXRhLWNvbnRlbnQtdHlwZSo9XCJwZGZcIl0sXG4gICAgJltkYXRhLWNvbnRlbnQtdHlwZSo9XCJpbWFnZVwiXSB7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgICAgbWF4LWhlaWdodDogMTAwJTtcbiAgICB9XG5cbiAgICAmW2RhdGEtY29udGVudC10eXBlKj1cImltYWdlXCJdIHtcbiAgICAgIGltZyB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJltkYXRhLWNvbnRlbnQtdHlwZSo9XCJwZGZcIl0ge1xuICAgICAgaWZyYW1lIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaDEge1xuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuICB9XG5cbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOlxuICAgIG9wYWNpdHkgMC4zcyBlYXNlLFxuICAgIHZpc2liaWxpdHkgMC4zcyBlYXNlO1xuXG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbi5hY3RpdmUtcG9wb3Zlcixcbi5wb3BvdmVyOmhvdmVyIHtcbiAgYW5pbWF0aW9uOiBkcm9waW4gMC4zcyBlYXNlO1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBmb3J3YXJkcztcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjJzO1xufVxuIl19 */`;import{Features,transform}from"lightningcss";import{transform as transpile}from"esbuild";function getComponentResources(ctx){let allComponents=new Set;for(let emitter of ctx.cfg.plugins.emitters){let components=emitter.getQuartzComponents?.(ctx)??[];for(let component of components)allComponents.add(component)}let componentResources={css:new Set,beforeDOMLoaded:new Set,afterDOMLoaded:new Set};function normalizeResource(resource){return resource?Array.isArray(resource)?resource:[resource]:[]}__name(normalizeResource,"normalizeResource");for(let component of allComponents){let{css,beforeDOMLoaded,afterDOMLoaded}=component,normalizedCss=normalizeResource(css),normalizedBeforeDOMLoaded=normalizeResource(beforeDOMLoaded),normalizedAfterDOMLoaded=normalizeResource(afterDOMLoaded);normalizedCss.forEach(c=>componentResources.css.add(c)),normalizedBeforeDOMLoaded.forEach(b=>componentResources.beforeDOMLoaded.add(b)),normalizedAfterDOMLoaded.forEach(a=>componentResources.afterDOMLoaded.add(a))}return{css:[...componentResources.css],beforeDOMLoaded:[...componentResources.beforeDOMLoaded],afterDOMLoaded:[...componentResources.afterDOMLoaded]}}__name(getComponentResources,"getComponentResources");async function joinScripts(scripts){let script=scripts.map(script2=>`(function () {${script2}})();`).join(`
`);return(await transpile(script,{minify:!0})).code}__name(joinScripts,"joinScripts");function addGlobalPageResources(ctx,componentResources){let cfg=ctx.cfg.configuration;if(cfg.enablePopovers&&(componentResources.afterDOMLoaded.push(popover_inline_default),componentResources.css.push(popover_default)),cfg.analytics?.provider==="google"){let tagId=cfg.analytics.tagId;componentResources.afterDOMLoaded.push(`
      const gtagScript = document.createElement('script');
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=${tagId}';
      gtagScript.defer = true;
      gtagScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', '${tagId}', { send_page_view: false });
        gtag('event', 'page_view', { page_title: document.title, page_location: location.href });
        document.addEventListener('nav', () => {
          gtag('event', 'page_view', { page_title: document.title, page_location: location.href });
        });
      };
      
      document.head.appendChild(gtagScript);
    `)}else if(cfg.analytics?.provider==="plausible"){let plausibleHost=cfg.analytics.host??"https://plausible.io";componentResources.afterDOMLoaded.push(`
      const plausibleScript = document.createElement('script');
      plausibleScript.src = '${plausibleHost}/js/script.manual.js';
      plausibleScript.setAttribute('data-domain', location.hostname);
      plausibleScript.defer = true;
      plausibleScript.onload = () => {
        window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
        plausible('pageview');
        document.addEventListener('nav', () => {
          plausible('pageview');
        });
      };

      document.head.appendChild(plausibleScript);
    `)}else if(cfg.analytics?.provider==="umami")componentResources.afterDOMLoaded.push(`
      const umamiScript = document.createElement("script");
      umamiScript.src = "${cfg.analytics.host??"https://analytics.umami.is"}/script.js";
      umamiScript.setAttribute("data-website-id", "${cfg.analytics.websiteId}");
      umamiScript.setAttribute("data-auto-track", "true");
      umamiScript.defer = true;

      document.head.appendChild(umamiScript);
    `);else if(cfg.analytics?.provider==="goatcounter")componentResources.afterDOMLoaded.push(`
      const goatcounterScriptPre = document.createElement('script');
      goatcounterScriptPre.textContent = \`
        window.goatcounter = { no_onload: true };
      \`;
      document.head.appendChild(goatcounterScriptPre);

      const endpoint = "https://${cfg.analytics.websiteId}.${cfg.analytics.host??"goatcounter.com"}/count";
      const goatcounterScript = document.createElement('script');
      goatcounterScript.src = "${cfg.analytics.scriptSrc??"https://gc.zgo.at/count.js"}";
      goatcounterScript.defer = true;
      goatcounterScript.setAttribute('data-goatcounter', endpoint);
      goatcounterScript.onload = () => {
        window.goatcounter.endpoint = endpoint;
        goatcounter.count({ path: location.pathname });
        document.addEventListener('nav', () => {
          goatcounter.count({ path: location.pathname });
        });
      };

      document.head.appendChild(goatcounterScript);
    `);else if(cfg.analytics?.provider==="posthog")componentResources.afterDOMLoaded.push(`
      const posthogScript = document.createElement("script");
      posthogScript.innerHTML= \`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init('${cfg.analytics.apiKey}', {
        api_host: '${cfg.analytics.host??"https://app.posthog.com"}',
        capture_pageview: false,
      });
      document.addEventListener('nav', () => {
        posthog.capture('$pageview', { path: location.pathname });
      })\`

      document.head.appendChild(posthogScript);
    `);else if(cfg.analytics?.provider==="tinylytics"){let siteId=cfg.analytics.siteId;componentResources.afterDOMLoaded.push(`
      const tinylyticsScript = document.createElement('script');
      tinylyticsScript.src = 'https://tinylytics.app/embed/${siteId}.js?spa';
      tinylyticsScript.defer = true;
      tinylyticsScript.onload = () => {
        window.tinylytics.triggerUpdate();
        document.addEventListener('nav', () => {
          window.tinylytics.triggerUpdate();
        });
      };
      
      document.head.appendChild(tinylyticsScript);
    `)}else cfg.analytics?.provider==="cabin"?componentResources.afterDOMLoaded.push(`
      const cabinScript = document.createElement("script")
      cabinScript.src = "${cfg.analytics.host??"https://scripts.withcabin.com"}/hello.js"
      cabinScript.defer = true
      document.head.appendChild(cabinScript)
    `):cfg.analytics?.provider==="clarity"?componentResources.afterDOMLoaded.push(`
      const clarityScript = document.createElement("script")
      clarityScript.innerHTML= \`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.defer=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${cfg.analytics.projectId}");\`
      document.head.appendChild(clarityScript)
    `):cfg.analytics?.provider==="matomo"?componentResources.afterDOMLoaded.push(`
      const matomoScript = document.createElement("script");
      matomoScript.innerHTML = \`
      let _paq = window._paq = window._paq || [];

      // Track SPA navigation
      // https://developer.matomo.org/guides/spa-tracking
      document.addEventListener("nav", () => {
        _paq.push(['setCustomUrl', location.pathname]);
        _paq.push(['setDocumentTitle', document.title]);
        _paq.push(['trackPageView']);
      });

      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        const u="//${cfg.analytics.host}/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', ${cfg.analytics.siteId}]);
        const d=document, g=d.createElement('script'), s=d.getElementsByTagName
('script')[0];
        g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
      })();
      \`
      document.head.appendChild(matomoScript);
    `):cfg.analytics?.provider==="vercel"?(componentResources.beforeDOMLoaded.push(`
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    `),componentResources.afterDOMLoaded.push(`
      const vercelInsightsScript = document.createElement("script")
      vercelInsightsScript.src = "/_vercel/insights/script.js"
      vercelInsightsScript.defer = true
      document.head.appendChild(vercelInsightsScript)
    `)):cfg.analytics?.provider==="rybbit"&&componentResources.afterDOMLoaded.push(`
      const rybbitScript = document.createElement("script");
      rybbitScript.src = "${cfg.analytics.host??"https://app.rybbit.io"}/api/script.js";
      rybbitScript.setAttribute("data-site-id", "${cfg.analytics.siteId}");
      rybbitScript.async = true;
      rybbitScript.defer = true;

      document.head.appendChild(rybbitScript);
    `);cfg.enableSPA?componentResources.afterDOMLoaded.push(spa_inline_default):componentResources.afterDOMLoaded.push(`
      window.spaNavigate = (url, _) => window.location.assign(url)
      window.addCleanup = () => {}
      const event = new CustomEvent("nav", { detail: { url: document.body.dataset.slug } })
      document.dispatchEvent(event)
    `)}__name(addGlobalPageResources,"addGlobalPageResources");var ComponentResources=__name(()=>({name:"ComponentResources",async*emit(ctx,_content,_resources){let cfg=ctx.cfg.configuration,componentResources=getComponentResources(ctx),googleFontsStyleSheet="";if(cfg.theme.fontOrigin!=="local"){if(cfg.theme.fontOrigin==="googleFonts"&&!cfg.theme.cdnCaching){let theme=ctx.cfg.configuration.theme;if(googleFontsStyleSheet=await(await fetch(googleFontHref(theme))).text(),theme.typography.title){let title=ctx.cfg.configuration.pageTitle,response2=await fetch(googleFontSubsetHref(theme,title));googleFontsStyleSheet+=`
${await response2.text()}`}if(!cfg.baseUrl)throw new Error("baseUrl must be defined when using Google Fonts without cfg.theme.cdnCaching");let{processedStylesheet,fontFiles}=await processGoogleFonts(googleFontsStyleSheet,cfg.baseUrl);googleFontsStyleSheet=processedStylesheet;for(let fontFile of fontFiles){let res=await fetch(fontFile.url);if(!res.ok)throw new Error(`Failed to fetch font ${fontFile.filename}`);let buf=await res.arrayBuffer();yield write({ctx,slug:joinSegments("static","fonts",fontFile.filename),ext:`.${fontFile.extension}`,content:Buffer.from(buf)})}}}addGlobalPageResources(ctx,componentResources);let stylesheet=joinStyles(ctx.cfg.configuration.theme,googleFontsStyleSheet,...componentResources.css,custom_default),[prescript,postscript]=await Promise.all([joinScripts(componentResources.beforeDOMLoaded),joinScripts(componentResources.afterDOMLoaded)]);yield write({ctx,slug:"index",ext:".css",content:transform({filename:"index.css",code:Buffer.from(stylesheet),minify:!0,targets:{safari:984576,ios_saf:984576,edge:7536640,firefox:6684672,chrome:7143424},include:Features.MediaQueries}).code.toString()}),yield write({ctx,slug:"prescript",ext:".js",content:prescript}),yield write({ctx,slug:"postscript",ext:".js",content:postscript})},async*partialEmit(){}}),"ComponentResources");var NotFoundPage=__name(()=>{let opts={...sharedPageComponents,pageBody:__default(),beforeBody:[],left:[],right:[]},{head:Head,pageBody,footer:Footer}=opts,Body2=Body_default();return{name:"404Page",getQuartzComponents(){return[Head,Body2,pageBody,Footer]},async*emit(ctx,_content,resources){let cfg=ctx.cfg.configuration,slug="404",path12=new URL(`https://${cfg.baseUrl??"example.com"}`).pathname,notFound=i18n(cfg.locale).pages.error.title,[tree,vfile]=defaultProcessedContent({slug,text:notFound,description:notFound,frontmatter:{title:notFound,tags:[]}}),externalResources=pageResources(path12,resources),componentData={ctx,fileData:vfile.data,externalResources,cfg,children:[],tree,allFiles:[]};yield write({ctx,content:renderPage(cfg,slug,componentData,opts,externalResources),slug,ext:".html"})},async*partialEmit(){}}},"NotFoundPage");function getStaticResourcesFromPlugins(ctx){let staticResources={css:[],js:[],additionalHead:[]};for(let transformer of[...ctx.cfg.plugins.transformers,...ctx.cfg.plugins.emitters]){let res=transformer.externalResources?transformer.externalResources(ctx):{};res?.js&&staticResources.js.push(...res.js),res?.css&&staticResources.css.push(...res.css),res?.additionalHead&&staticResources.additionalHead.push(...res.additionalHead)}if(ctx.argv.serve){let wsUrl=ctx.argv.remoteDevHost?`wss://${ctx.argv.remoteDevHost}:${ctx.argv.wsPort}`:`ws://localhost:${ctx.argv.wsPort}`;staticResources.js.push({loadTime:"afterDOMReady",contentType:"inline",script:`
        const socket = new WebSocket('${wsUrl}')
        // reload(true) ensures resources like images and scripts are fetched again in firefox
        socket.addEventListener('message', () => document.location.reload(true))
      `})}return staticResources}__name(getStaticResourcesFromPlugins,"getStaticResourcesFromPlugins");import{styleText as styleText7}from"util";async function emitContent(ctx,content){let{argv,cfg}=ctx,perf=new PerfTimer,log=new QuartzLogger(ctx.argv.verbose);log.start("Emitting files");let emittedFiles=0,staticResources=getStaticResourcesFromPlugins(ctx);await Promise.all(cfg.plugins.emitters.map(async emitter=>{try{let emitted=await emitter.emit(ctx,content,staticResources);if(Symbol.asyncIterator in emitted)for await(let file of emitted)emittedFiles++,ctx.argv.verbose?console.log(`[emit:${emitter.name}] ${file}`):log.updateText(`${emitter.name} -> ${styleText7("gray",file)}`);else{emittedFiles+=emitted.length;for(let file of emitted)ctx.argv.verbose?console.log(`[emit:${emitter.name}] ${file}`):log.updateText(`${emitter.name} -> ${styleText7("gray",file)}`)}}catch(err){trace(`Failed to emit from plugin \`${emitter.name}\``,err)}})),log.end(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince()}`)}__name(emitContent,"emitContent");var config={configuration:{pageTitle:"\u6B65\u516D\u5B64.Today",pageTitleSuffix:" \xB7 Binary Garden",enableSPA:!0,enablePopovers:!0,analytics:{provider:"plausible"},locale:"zh-CN",baseUrl:"todaymvp.github.io",ignorePatterns:["private","templates",".obsidian"],defaultDateType:"created",theme:{fontOrigin:"local",cdnCaching:!0,typography:{header:"Noto Serif SC",body:"Noto Sans SC",code:"JetBrains Mono"},colors:{lightMode:{light:"#f5f8fc",lightgray:"#e1e8f0",gray:"#8b9bb5",darkgray:"#3a4a5c",dark:"#1e2a36",secondary:"#3a6ea5",tertiary:"#5d8fc0",highlight:"rgba(58, 110, 165, 0.1)",textHighlight:"#a0c4e888"},darkMode:{light:"#1a2332",lightgray:"#263345",gray:"#4a5b6e",darkgray:"#b4c0d0",dark:"#e0e8f2",secondary:"#6b9fd4",tertiary:"#8ab8e8",highlight:"rgba(107, 159, 212, 0.15)",textHighlight:"#4a6a8a88"}}}},plugins:{transformers:[FrontMatter(),CreatedModifiedDate({priority:["frontmatter","git","filesystem"]}),SyntaxHighlighting({theme:{light:"github-light",dark:"github-dark"},keepBackground:!1}),ObsidianFlavoredMarkdown({enableInHtmlEmbed:!1}),GitHubFlavoredMarkdown(),TableOfContents(),CrawlLinks({markdownLinkResolution:"shortest"}),Description(),Latex({renderEngine:"katex"})],filters:[RemoveDrafts()],emitters:[AliasRedirects(),ComponentResources(),ContentPage(),FolderPage(),TagPage(),ContentIndex({enableSiteMap:!0,enableRSS:!0}),Assets(),Static(),Favicon(),NotFoundPage()]}},quartz_config_default=config;import chokidar from"chokidar";import fs5 from"fs";import{fileURLToPath}from"url";var options={retrieveSourceMap(source){if(source.includes(".quartz-cache")){let realSource=fileURLToPath(source.split("?",2)[0]+".map");return{map:fs5.readFileSync(realSource,"utf8")}}else return null}};function randomIdNonSecure(){return Math.random().toString(36).substring(2,8)}__name(randomIdNonSecure,"randomIdNonSecure");import{minimatch}from"minimatch";sourceMapSupport.install(options);async function buildQuartz(argv,mut,clientRefresh){let ctx={buildId:randomIdNonSecure(),argv,cfg:quartz_config_default,allSlugs:[],allFiles:[],incremental:!1},perf=new PerfTimer,output=argv.output,pluginCount=Object.values(quartz_config_default.plugins).flat().length,pluginNames=__name(key=>quartz_config_default.plugins[key].map(plugin=>plugin.name),"pluginNames");argv.verbose&&(console.log(`Loaded ${pluginCount} plugins`),console.log(`  Transformers: ${pluginNames("transformers").join(", ")}`),console.log(`  Filters: ${pluginNames("filters").join(", ")}`),console.log(`  Emitters: ${pluginNames("emitters").join(", ")}`));let release=await mut.acquire();perf.addEvent("clean"),await rm(output,{recursive:!0,force:!0}),console.log(`Cleaned output directory \`${output}\` in ${perf.timeSince("clean")}`),perf.addEvent("glob");let allFiles=await glob("**/*.*",argv.directory,quartz_config_default.configuration.ignorePatterns),markdownPaths=allFiles.filter(fp=>fp.endsWith(".md")).sort();console.log(`Found ${markdownPaths.length} input files from \`${argv.directory}\` in ${perf.timeSince("glob")}`);let filePaths=markdownPaths.map(fp=>joinSegments(argv.directory,fp));ctx.allFiles=allFiles,ctx.allSlugs=allFiles.map(fp=>slugifyFilePath(fp));let parsedFiles=await parseMarkdown(ctx,filePaths),filteredContent=filterContent(ctx,parsedFiles);if(await emitContent(ctx,filteredContent),console.log(styleText8("green",`Done processing ${markdownPaths.length} files in ${perf.timeSince()}`)),release(),argv.watch)return ctx.incremental=!0,startWatching(ctx,mut,parsedFiles,clientRefresh)}__name(buildQuartz,"buildQuartz");async function startWatching(ctx,mut,initialContent,clientRefresh){let{argv,allFiles}=ctx,contentMap=new Map;for(let filePath of allFiles)contentMap.set(filePath,{type:"other"});for(let content of initialContent){let[_tree,vfile]=content;contentMap.set(vfile.data.relativePath,{type:"markdown",content})}let gitIgnoredMatcher=await isGitIgnored(),buildData={ctx,mut,contentMap,ignored:__name(fp=>{let pathStr=toPosixPath(fp.toString());if(pathStr.startsWith(".git/")||gitIgnoredMatcher(pathStr))return!0;for(let pattern of quartz_config_default.configuration.ignorePatterns)if(minimatch(pathStr,pattern))return!0;return!1},"ignored"),changesSinceLastBuild:{},lastBuildMs:0},watcher=chokidar.watch(".",{awaitWriteFinish:{stabilityThreshold:250},persistent:!0,cwd:argv.directory,ignoreInitial:!0}),changes=[];return watcher.on("add",fp=>{fp=toPosixPath(fp),!buildData.ignored(fp)&&(changes.push({path:fp,type:"add"}),rebuild(changes,clientRefresh,buildData))}).on("change",fp=>{fp=toPosixPath(fp),!buildData.ignored(fp)&&(changes.push({path:fp,type:"change"}),rebuild(changes,clientRefresh,buildData))}).on("unlink",fp=>{fp=toPosixPath(fp),!buildData.ignored(fp)&&(changes.push({path:fp,type:"delete"}),rebuild(changes,clientRefresh,buildData))}),async()=>{await watcher.close()}}__name(startWatching,"startWatching");async function rebuild(changes,clientRefresh,buildData){let{ctx,contentMap,mut,changesSinceLastBuild}=buildData,{argv,cfg}=ctx,buildId=randomIdNonSecure();ctx.buildId=buildId,buildData.lastBuildMs=new Date().getTime();let numChangesInBuild=changes.length,release=await mut.acquire();if(ctx.buildId!==buildId){release();return}let perf=new PerfTimer;perf.addEvent("rebuild"),console.log(styleText8("yellow","Detected change, rebuilding..."));for(let change of changes)changesSinceLastBuild[change.path]=change.type;let staticResources=getStaticResourcesFromPlugins(ctx),pathsToParse=[];for(let[fp,type]of Object.entries(changesSinceLastBuild)){if(type==="delete"||path11.extname(fp)!==".md")continue;let fullPath=joinSegments(argv.directory,toPosixPath(fp));pathsToParse.push(fullPath)}let parsed=await parseMarkdown(ctx,pathsToParse);for(let content of parsed)contentMap.set(content[1].data.relativePath,{type:"markdown",content});for(let[file,change]of Object.entries(changesSinceLastBuild))change==="delete"&&contentMap.delete(file),change==="add"&&path11.extname(file)!==".md"&&contentMap.set(file,{type:"other"});let changeEvents=Object.entries(changesSinceLastBuild).map(([fp,type])=>{let path12=fp,processedContent=contentMap.get(path12);if(processedContent?.type==="markdown"){let[_tree,file]=processedContent.content;return{type,path:path12,file}}return{type,path:path12}});ctx.allFiles=Array.from(contentMap.keys()),ctx.allSlugs=ctx.allFiles.map(fp=>slugifyFilePath(fp));let processedFiles=filterContent(ctx,Array.from(contentMap.values()).filter(file=>file.type==="markdown").map(file=>file.content)),emittedFiles=0;for(let emitter of cfg.plugins.emitters){let emitted=await(emitter.partialEmit??emitter.emit)(ctx,processedFiles,staticResources,changeEvents);if(emitted!==null){if(Symbol.asyncIterator in emitted)for await(let file of emitted)emittedFiles++,ctx.argv.verbose&&console.log(`[emit:${emitter.name}] ${file}`);else if(emittedFiles+=emitted.length,ctx.argv.verbose)for(let file of emitted)console.log(`[emit:${emitter.name}] ${file}`)}}console.log(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince("rebuild")}`),console.log(styleText8("green",`Done rebuilding in ${perf.timeSince()}`)),changes.splice(0,numChangesInBuild),clientRefresh(),release()}__name(rebuild,"rebuild");var build_default=__name(async(argv,mut,clientRefresh)=>{try{return await buildQuartz(argv,mut,clientRefresh)}catch(err){trace(`
Exiting Quartz due to a fatal error`,err)}},"default");export{build_default as default};
//# sourceMappingURL=transpiled-build.mjs.map
