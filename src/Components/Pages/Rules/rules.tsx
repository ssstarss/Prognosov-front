import './rules.scss';

export default function RulesPage() {
  return (
    <div className="pageWrapper">
      <div className="pageCard pageCard--scrollBody">
        <div className="formHeaderRow">
          <h2 className="formHeaderTitle">ПРАВИЛА КОНКУРСА</h2>
        </div>
        <div className="rulesContent">
          <p className="rulesLead">Регламент конкурса прогнозов ЧМ 2026 по футболу.</p>

          <section className="rulesSection">
            <h3 className="rulesSectionTitle">Общие положения</h3>
            <p>
              Организатор конкурса - неизменный куратор Сергей, e-mail:{' '}
              <a href="mailto:s.s.star@mail.ru">s.s.star@mail.ru</a>.
            </p>
            <p>
              Вступительный взнос - 2000 руб. Взнос вносится в общую кассу через организатора
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
              Главный приз каждого этапа - официальный мяч ЧМ 2026 Trionda для единоличного
              победителя. Поощрительные призы за 2-3 места определяются по числу участников и
              призовому фонду.
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
              умолчанию засчитывается счет 0:0.
            </p>
            <p>
              Фактические результаты вносит организатор, после чего автоматически обновляется
              таблица конкурса.
            </p>
          </section>

          <section className="rulesSection">
            <h3 className="rulesSectionTitle">Начисление очков</h3>
            <ul className="rulesList">
              <li>Угадан победитель матча - 2 очка.</li>
              <li>Угаданы победитель и разница мячей - 3 очка.</li>
              <li>Угадан счет в случае ничьей - 4 очка.</li>
              <li>Угаданы победитель и точный счет в матче с победителем - 5 очков.</li>
            </ul>
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
              <a href="tel:+79132344444">+7 913 234-44-44</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
