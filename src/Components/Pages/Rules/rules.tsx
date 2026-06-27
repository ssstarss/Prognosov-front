import './rules.scss';
import smartBall from '../../../assets/svg/smartBall.png';
export default function RulesPage() {
  return (
    <div className="pageWrapper">
      <div className="pageCard pageCard--scrollBody">
        <div className="formHeaderRow">
          <h2 className="formHeaderTitle">ПРАВИЛА КОНКУРСА</h2>
        </div>
        <div className="rulesContent">
          <img src={smartBall} alt="" className="logo" />
          <p className="rulesLead">Регламент конкурса прогнозов ЧМ 2026 по футболу.</p>

          <section className="rulesSection">
            <h3 className="rulesSectionTitle">Общие положения</h3>

            <p>
              Организатор конкурса - неизменный куратор Сергей, e-mail:{' '}
              <a href="mailto:s.s.star@mail.ru">s.s.star@mail.ru</a>.
            </p>
            <p>
              Вступительный взнос - <strong>2200 руб.</strong> Взнос вносится в общую кассу через организатора
              конкурса до начала турнира.
            </p>
            <p>Конкурс проходит на сайте prognosov.ru.</p>
          </section>

          <section className="rulesSection">
            <h3 className="rulesSectionTitle">Этапы конкурса</h3>
            <ul className="rulesList">
              <li>
                <strong>Регулярный чемпионат</strong> - прогнозы на матчи групповой стадии.
              </li>
              <li>
                <strong>Play Off</strong> - прогнозы на матчи финальной части турнира.
              </li>
            </ul>
            <p>
            <strong>Главный приз каждого этапа</strong> — официальный мяч ЧМ-2026 <strong>Trionda</strong>, который получает единоличный победитель.
<strong>Поощрительные призы за 2–3 места</strong> определяются в зависимости от количества участников и призового фонда.

Участник может получить только один приз. Если игрок становится призёром в обеих частях турнира, он получает приз за более высокое место. 
Если место в обеих частях одинаковое, приоритет отдаётся Регулярному чемпионату. В оставшемся этапе
 приз такого участника переходит игроку, занявшему следующее за ним место.
            </p>
          </section>

          <section className="rulesSection">
            <h3 className="rulesSectionTitle">Как подаются прогнозы</h3>
            <p>
              До начала конкурса организатор регистрирует участников и отправляет данные для входа в
              личный кабинет.
            </p>
            <p>
              Прогноз на каждый матч вносится в разделе «Мои прогнозы» или в таблице турнира не
              позднее чем за <strong>1 час</strong> до стартового времени игры. Время отображается в{' '}
              <strong>часовом поясе пользователя</strong>.
            </p>
            <p>
              После дедлайна редактирование закрывается. Если прогноз не внесен вовремя, по
              умолчанию засчитывается счет 0:0 (<strong>Автопрогноз</strong>).
            </p>
            <p>
              Фактические результаты вносит организатор, после чего автоматически обновляется
              таблица конкурса.
            </p>
          </section>

          <section className="rulesSection">
            <h3 className="rulesSectionTitle">Начисление очков</h3>
            <ul className="rulesList rulesScoringList">
              <li>
                <span className="rulesScoreBadge rulesScoreBadge--blue">2</span>
                Угадан победитель матча.
              </li>
              <li>
                <span className="rulesScoreBadge rulesScoreBadge--green">3</span>
                Угаданы победитель и разница мячей или ничья без счёта.
              </li>
              <li>
                <span className="rulesScoreBadge rulesScoreBadge--aqua">4</span>
                Угадан счет в случае ничьей.
              </li>
              <li>
                <span className="rulesScoreBadge rulesScoreBadge--orange">5</span>
                Угаданы победитель и точный счет в матче с победителем.
              </li>
              <li>
                <span className="rulesScoreBadge rulesScoreBadge--brown">1</span>
                Автопрогноз в случае угаданной ничьей.
              </li> 
              <li>
                <span className="rulesScoreBadge rulesScoreBadge--brown">2</span>
                Автопрогноз в случае угаданного счёта ничьей.
              </li>
            </ul>
            <p>
            <h3 className="rulesSectionTitle">Коэффициенты подсчета очков для матчей на вылет в Регулярном чемпионате</h3>
              В <strong>Регулярном чемпионате</strong> результат прогноза в 
              играх на вылет считается с коэффициентом <strong>×2</strong>, в{' '}
              <strong>финальной</strong> игре — <strong>×4</strong>.  В случае <strong>Автопрогноза</strong>  коэффициент не применяется.
            </p>
            <p>
              В матчах «на вылет» учитывается только результат основного и дополнительного времени.
              Без пенальти
            </p>
          </section>

          <section className="rulesSection">
            <h3 className="rulesSectionTitle">Определение победителя</h3>
            <p>Побеждает участник, набравший максимальное количество очков.</p>
            <p>При равенстве очков учитываются, по порядку:</p>
            <ol className="rulesOrderedList">
              <li>Количество угаданных победителей матчей.</li>
              <li>Количество угаданных победителей с разницей мячей.</li>
              <li>Количество угаданных ничейных счетов.</li>
              <li>Количество угаданных счетов в матчах с победителем.</li>
            </ol>
            <p>
              Если и эти показатели равны: при проживании в одном городе - серия пенальти, иначе -
              жребий.
            </p>
          </section>

          <section className="rulesSection">
            <h3 className="rulesSectionTitle">Контакты</h3>
            <p>
              Участие в конкурсе означает согласие с правилами. По вопросам:{' '}
              <a href="mailto:s.s.star@mail.ru">s.s.star@mail.ru</a> или{' '}
              <a href="tel:+79132344444">+7 913-234-4444</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
