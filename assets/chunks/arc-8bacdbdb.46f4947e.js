import{c as G,p as sn}from"./constant-b644328d.6af51708.js";import{ay as en,az as y,T as ln,aA as S,aB as D,aC as K,aD as b,aE as an,aF as rn,aG as t,aH as un,aI as on,aJ as tn}from"../app.2f2903fd.js";function fn(l){return l.innerRadius}function cn(l){return l.outerRadius}function yn(l){return l.startAngle}function gn(l){return l.endAngle}function mn(l){return l&&l.padAngle}function pn(l,x,q,E,h,v,H,a){var s=q-l,n=E-x,m=H-h,i=a-v,r=i*s-m*n;if(!(r*r<y))return r=(m*(x-v)-i*(l-h))/r,[l+r*s,x+r*n]}function U(l,x,q,E,h,v,H){var a=l-q,s=x-E,n=(H?v:-v)/K(a*a+s*s),m=n*s,i=-n*a,r=l+m,f=x+i,c=q+m,w=E+i,o=(r+c)/2,z=(f+w)/2,p=c-r,g=w-f,A=p*p+g*g,B=h-v,P=r*w-c*f,C=(g<0?-1:1)*K(tn(0,B*B*A-P*P)),F=(P*g-p*C)/A,d=(-P*p-g*C)/A,R=(P*g+p*C)/A,T=(-P*p+g*C)/A,e=F-o,u=d-z,J=R-o,O=T-z;return e*e+u*u>J*J+O*O&&(F=R,d=T),{cx:F,cy:d,x01:-m,y01:-i,x11:F*(h/B-1),y11:d*(h/B-1)}}function hn(){var l=fn,x=cn,q=G(0),E=null,h=yn,v=gn,H=mn,a=null;function s(){var n,m,i=+l.apply(this,arguments),r=+x.apply(this,arguments),f=h.apply(this,arguments)-en,c=v.apply(this,arguments)-en,w=an(c-f),o=c>f;if(a||(a=n=sn()),r<i&&(m=r,r=i,i=m),!(r>y))a.moveTo(0,0);else if(w>ln-y)a.moveTo(r*S(f),r*D(f)),a.arc(0,0,r,f,c,!o),i>y&&(a.moveTo(i*S(c),i*D(c)),a.arc(0,0,i,c,f,o));else{var z=f,p=c,g=f,A=c,B=w,P=w,C=H.apply(this,arguments)/2,F=C>y&&(E?+E.apply(this,arguments):K(i*i+r*r)),d=b(an(r-i)/2,+q.apply(this,arguments)),R=d,T=d,e,u;if(F>y){var J=un(F/i*D(C)),O=un(F/r*D(C));(B-=J*2)>y?(J*=o?1:-1,g+=J,A-=J):(B=0,g=A=(f+c)/2),(P-=O*2)>y?(O*=o?1:-1,z+=O,p-=O):(P=0,z=p=(f+c)/2)}var $=r*S(z),j=r*D(z),L=i*S(A),M=i*D(A);if(d>y){var N=r*S(p),Q=r*D(p),V=i*S(g),W=i*D(g),I;if(w<rn&&(I=pn($,j,V,W,N,Q,L,M))){var X=$-I[0],Y=j-I[1],Z=N-I[0],k=Q-I[1],_=1/D(on((X*Z+Y*k)/(K(X*X+Y*Y)*K(Z*Z+k*k)))/2),nn=K(I[0]*I[0]+I[1]*I[1]);R=b(d,(i-nn)/(_-1)),T=b(d,(r-nn)/(_+1))}}P>y?T>y?(e=U(V,W,$,j,r,T,o),u=U(N,Q,L,M,r,T,o),a.moveTo(e.cx+e.x01,e.cy+e.y01),T<d?a.arc(e.cx,e.cy,T,t(e.y01,e.x01),t(u.y01,u.x01),!o):(a.arc(e.cx,e.cy,T,t(e.y01,e.x01),t(e.y11,e.x11),!o),a.arc(0,0,r,t(e.cy+e.y11,e.cx+e.x11),t(u.cy+u.y11,u.cx+u.x11),!o),a.arc(u.cx,u.cy,T,t(u.y11,u.x11),t(u.y01,u.x01),!o))):(a.moveTo($,j),a.arc(0,0,r,z,p,!o)):a.moveTo($,j),!(i>y)||!(B>y)?a.lineTo(L,M):R>y?(e=U(L,M,N,Q,i,-R,o),u=U($,j,V,W,i,-R,o),a.lineTo(e.cx+e.x01,e.cy+e.y01),R<d?a.arc(e.cx,e.cy,R,t(e.y01,e.x01),t(u.y01,u.x01),!o):(a.arc(e.cx,e.cy,R,t(e.y01,e.x01),t(e.y11,e.x11),!o),a.arc(0,0,i,t(e.cy+e.y11,e.cx+e.x11),t(u.cy+u.y11,u.cx+u.x11),o),a.arc(u.cx,u.cy,R,t(u.y11,u.x11),t(u.y01,u.x01),!o))):a.arc(0,0,i,A,g,o)}if(a.closePath(),n)return a=null,n+""||null}return s.centroid=function(){var n=(+l.apply(this,arguments)+ +x.apply(this,arguments))/2,m=(+h.apply(this,arguments)+ +v.apply(this,arguments))/2-rn/2;return[S(m)*n,D(m)*n]},s.innerRadius=function(n){return arguments.length?(l=typeof n=="function"?n:G(+n),s):l},s.outerRadius=function(n){return arguments.length?(x=typeof n=="function"?n:G(+n),s):x},s.cornerRadius=function(n){return arguments.length?(q=typeof n=="function"?n:G(+n),s):q},s.padRadius=function(n){return arguments.length?(E=n==null?null:typeof n=="function"?n:G(+n),s):E},s.startAngle=function(n){return arguments.length?(h=typeof n=="function"?n:G(+n),s):h},s.endAngle=function(n){return arguments.length?(v=typeof n=="function"?n:G(+n),s):v},s.padAngle=function(n){return arguments.length?(H=typeof n=="function"?n:G(+n),s):H},s.context=function(n){return arguments.length?(a=n??null,s):a},s}export{hn as d};