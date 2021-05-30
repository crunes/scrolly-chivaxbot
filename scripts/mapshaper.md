# mapshaper commands


## vaccinated maps - sequential
```
rename-fields "vax_pct=Vaccine Series Completed  - Percent Population"
classify vax_pct colors=Greens breaks=.1,.2,.3,.4,.5,.6,.7,.8,.9
proj EPSG:3435
style stroke=white stroke-width=.1
```

## unvaccinated maps - sequential
```
rename-fields "vax_pct=Vaccine Series Completed  - Percent Population"
each "unvax_pct=1-vax_pct"
classify unvax_pct colors=Greens breaks=.1,.2,.3,.4,.5,.6,.7,.8,.9
proj EPSG:3435
style stroke=white stroke-width=.1
```

## vaccinated maps - diverging
```
rename-fields "vax_pct=Vaccine Series Completed  - Percent Population"
each "vax_pct=vax_pct*100"
classify vax_pct key-style=simple colors=PiYG breaks=10,20,30,40,50,60,70,80,90
proj EPSG:3435
style stroke=white stroke-width=.1
```
