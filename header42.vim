" --- 42 Header Script Start ---

let s:asciiart = [
            \"        :::      ::::::::",
            \"      :+:      :+:    :+:",
            \"    +:+ +:+         +:+  ",
            \"  +#+  +:+       +#+     ",
            \"+#+#+#+#+#+   +#+        ",
            \"     #+#    #+#          ",
            \"    ###   ########.tr    "
            \]

let s:start     = '/*'
let s:end       = '*/'
let s:fill      = '*'
let s:length    = 80
let s:margin    = 5

let s:types     = {
            \'\.c$\|\.h$\|\.cc$\|\.hh$\|\.cpp$\|\.hpp$\|\.php':
            \['/*', '*/', '*'],
            \'\.htm$\|\.html$\|\.xml$':
            \['', '*'],
            \'\.js$':
            \['//', '//', '*'],
            \'\.tex$':
            \['%', '%', '*'],
            \'\.ml$\|\.mli$\|\.mll$\|\.mly$':
            \['(*', '*)', '*'],
            \'\.vim$\|\vimrc$':
            \['"', '"', '*'],
            \'\.el$\|\emacs$':
            \[';', ';', '*'],
            \'\.f90$\|\.f95$\|\.f03$\|\.f$\|\.for$':
            \['!', '!', '/']
            \}

function! s:filetype()
    let l:f = s:filename()

    let s:start = '#'
    let s:end   = '#'
    let s:fill  = '*'

    for type in keys(s:types)
        if l:f =~ type
            let s:start = s:types[type][0]
            let s:end   = s:types[type][1]
            let s:fill  = s:types[type][2]
        endif
    endfor

endfunction

function! s:ascii(n)
    return s:asciiart[a:n - 3]
endfunction

function! s:textline(left, right)
    let l:left = strpart(a:left, 0, s:length - s:margin * 2 - strlen(a:right))

    return s:start . repeat(' ', s:margin - strlen(s:start)) . l:left . repeat(' ', s:length - s:margin * 2 - strlen(l:left) - strlen(a:right)) . a:right . repeat(' ', s:margin - strlen(s:end)) . s:end
endfunction

function! s:line(n)
    if a:n == 1 || a:n == 11 " top and bottom line
        return s:start . ' ' . repeat(s:fill, s:length - strlen(s:start) - strlen(s:end) - 2) . ' ' . s:end
    elseif a:n == 2 || a:n == 10 " blank line
        return s:textline('', '')
    elseif a:n == 3 || a:n == 5 || a:n == 7 " empty with ascii
        return s:textline('', s:ascii(a:n))
    elseif a:n == 4 " filename
        return s:textline(s:filename(), s:ascii(a:n))
    elseif a:n == 6 " author
        return s:textline("By: " . s:user() . " <" . s:mail() . ">", s:ascii(a:n))
    elseif a:n == 8 " created
        return s:textline("Created: " . s:date() . " by " . s:user(), s:ascii(a:n))
    elseif a:n == 9 " updated
        return s:textline("Updated: " . s:date() . " by " . s:user(), s:ascii(a:n))
    endif
endfunction

function! s:user()
    if exists('g:user42')
        return g:user42
    endif
    let l:user = $USER
    if strlen(l:user) == 0
        let l:user = "username"
    endif
    return l:user
endfunction

function! s:mail()
    if exists('g:mail42')
        return g:mail42
    endif
    let l:mail = $MAIL
    if strlen(l:mail) == 0
        let l:mail = "username@student.42istanbul.com.tr"
    endif
    return l:mail
endfunction

function! s:filename()
    let l:filename = expand("%:t")
    if strlen(l:filename) == 0
        let l:filename = "< new >"
    endif
    return l:filename
endfunction

function! s:date()
    return strftime("%Y/%m/%d %H:%M:%S")
endfunction

function! s:insert()
    " Prevent adding header if it already exists
    if getline(1) !~ '/*' " If 1st line doesn't start with '/*'
        let l:line = 11

        " empty line after header
        call append(0, "")

        " loop over lines
        while l:line > 0
            call append(0, s:line(l:line))
            let l:line = l:line - 1
        endwhile
    endif
endfunction

function! s:update()
    call s:filetype()
    " Check if line 9 exists and check its content (to prevent errors)
    if line('$') >= 9 && getline(9) =~ s:start . repeat(' ', s:margin - strlen(s:start)) . "Updated: "
        if &mod " If file is modified
            call setline(9, s:line(9))
        endif
        " Check if line 4 exists and check its content (to fix wrong filename)
        if line('$') >= 4 && getline(4) =~ s:start
            call setline(4, s:line(4))
        endif
        return 0 " Header exists, updated (or not needed)
    endif
    return 1 " Header not found
endfunction

function! s:stdheader()
    " If s:update() returns 1 (no header), s:insert() will run.
    if s:update()
        call s:insert()
    endif
endfunction

" *** FUNCTION THAT FIXES ALL ERRORS ***
function! s:RunHeaderOnAllArgs()
    " Runs :Header42 then :update for each file.
    silent argdo execute "Header42" | execute "update"
    
    " Go back to the first file when done (Correct command: 'first')
    silent first
endfunction

" --- Command, Shortcut, and Automation ---
" Bind command and shortcut
command! Header42 call s:stdheader ()
command! header42 call s:stdheader () " Lowercase alias
map <F1> :Header42<CR>

" --- SAFE AUTOMATION BLOCK ---
augroup Header42
    " Clear old commands in this group (prevents stacking)
    autocmd!

    " 1. SAVING: Update 'Updated:' line on save
    autocmd BufWritePre *.c,*.h,*.cc,*.hh,*.cpp,*.hpp,*.php call s:update()

    " 2. NEW FILE: Add header when a brand new file is created
    autocmd BufNewFile *.c,*.h,*.cc,*.hh,*.cpp,*.hpp,*.php call s:stdheader()

    " 3. EXISTING FILES: When opening existing files (e.g., vim *.c)
    autocmd VimEnter *.c,*.h,*.cc,*.hh,*.cpp,*.hpp,*.php call s:RunHeaderOnAllArgs()
augroup END

" --- 42 Header Script End ---